#!/usr/bin/env node
// Checks whether the DataWeave core-functions cheatsheet is out of date vs. the
// LIVE MuleSoft docs — a NEW DataWeave version, or Core functions the docs added
// that the article doesn't list yet.
//
// It NEVER edits the article and NEVER fabricates anything: it only reports the
// gap (for a human or the `dataweave-reference-syncer` subagent to sync verbatim).
//
// Signals (MuleSoft publishes no RSS feed; these are the reliable pollable ones):
//   1. `page-version` meta on the HTML of .../dataweave/latest/dw-core
//      → the version that `latest` currently resolves to (e.g. "2.12").
//   2. the function table in .../dataweave/latest/dw-core.md (the raw-markdown
//      twin) → the authoritative list of dw::Core functions.
//
// Usage:
//   node scripts/check-dataweave-version.mjs            # human report to stdout
//   node scripts/check-dataweave-version.mjs --json     # machine JSON to stdout
// In GitHub Actions it also appends booleans/markdown to $GITHUB_OUTPUT and
// $GITHUB_STEP_SUMMARY. Exit code is always 0 (the workflow decides what to do);
// a fetch/parse failure exits 2 so a docs outage doesn't masquerade as "in sync".

import { readFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARTICLE = join(ROOT, 'src/content/blog/dataweave-2-0-core-functions-cheatsheet.mdx');
const DOC_HTML = 'https://docs.mulesoft.com/dataweave/latest/dw-core';
const DOC_MD = 'https://docs.mulesoft.com/dataweave/latest/dw-core.md';

const jsonMode = process.argv.includes('--json');

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'prostdev-dw-version-check (+https://prostdev.com)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

// The post's display labels differ from the doc's function slugs; normalize both
// to the doc slug ("++", "--", "replace") before diffing.
const LABEL_TO_SLUG = (name) =>
  name
    .replace(/^Plus plus \(\+\+\)$/, '++')
    .replace(/^Minus minus \(--\)$/, '--')
    .replace(/^replace \(with\)$/, 'replace')
    .trim();

function parseArticle(src) {
  const versionMatch = src.match(/DataWeave version\s+\*{0,2}([0-9]+\.[0-9]+)/i);
  // Every function the article references via a dw-core-functions-<name> doc link.
  const funcs = new Set();
  const linkRe = /\[([^\]]+)\]\(https:\/\/docs\.mulesoft\.com\/[a-z0-9./-]*dw-core-functions-([a-z]+)\)/g;
  let m;
  while ((m = linkRe.exec(src))) funcs.add(m[2].toLowerCase());
  return { version: versionMatch?.[1] ?? null, funcs };
}

function parseLivePageVersion(html) {
  const m = html.match(/page-version"\s+content="([0-9]+\.[0-9]+)"/);
  return m?.[1] ?? null;
}

// The dw-core.md module index embeds the full function table as inline HTML:
//   <a href="dw-core-functions-NAME">NAME</a></p></td><td><p>DESCRIPTION</p></td>
function parseLiveFunctions(md) {
  const funcs = new Map(); // slug -> { display, desc }
  const re =
    /<a href="dw-core-functions-([^"]+)">([^<]+)<\/a><\/p><\/td><td><p>(.*?)<\/p><\/td>/g;
  let m;
  while ((m = re.exec(md))) {
    const slug = m[1].toLowerCase();
    const desc = m[3].replace(/<[^>]+>/g, '').trim();
    funcs.set(slug, { display: m[2], desc });
  }
  return funcs;
}

// "2.12" > "2.5" by numeric component, not string.
function isNewer(live, have) {
  if (!live || !have) return false;
  const a = live.split('.').map(Number);
  const b = have.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d > 0;
  }
  return false;
}

function emitOutputs(kv) {
  if (process.env.GITHUB_OUTPUT) {
    for (const [k, v] of Object.entries(kv)) {
      // multiline-safe heredoc form
      appendFileSync(process.env.GITHUB_OUTPUT, `${k}<<__EOF__\n${v}\n__EOF__\n`);
    }
  }
}

try {
  const article = parseArticle(readFileSync(ARTICLE, 'utf8'));
  const [html, md] = await Promise.all([fetchText(DOC_HTML), fetchText(DOC_MD)]);

  const liveVersion = parseLivePageVersion(html);
  const liveFuncs = parseLiveFunctions(md);
  if (!liveVersion || liveFuncs.size === 0) {
    throw new Error(
      `Could not parse docs (version=${liveVersion}, functions=${liveFuncs.size}). Page layout may have changed.`,
    );
  }

  // Diff function sets, after normalizing the article's display labels.
  const haveSlugs = new Set([...article.funcs].map(LABEL_TO_SLUG));
  const added = [...liveFuncs.keys()].filter((s) => !haveSlugs.has(s)).sort();
  const removed = [...haveSlugs].filter((s) => !liveFuncs.has(s)).sort();

  const versionOutdated = isNewer(liveVersion, article.version);
  const outdated = versionOutdated || added.length > 0;

  const report = {
    article: ARTICLE.replace(`${ROOT}/`, ''),
    articleVersion: article.version,
    liveVersion,
    versionOutdated,
    addedFunctions: added.map((s) => ({ name: liveFuncs.get(s).display, desc: liveFuncs.get(s).desc })),
    removedFunctions: removed, // present in article, gone from docs (rename/removal — verify by hand)
    outdated,
  };

  if (jsonMode) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`DataWeave cheatsheet version check`);
    console.log(`  article records: ${article.version ?? '??'}`);
    console.log(`  docs 'latest':   ${liveVersion}`);
    if (!outdated) {
      console.log(`\n✓ In sync — no new version and no new Core functions.`);
    } else {
      if (versionOutdated) console.log(`\n⚠ NEW VERSION: ${article.version} → ${liveVersion}`);
      if (added.length) {
        console.log(`\n⚠ ${added.length} Core function(s) in the docs not in the article:`);
        for (const s of added) console.log(`    - ${liveFuncs.get(s).display} — ${liveFuncs.get(s).desc}`);
      }
      if (removed.length) console.log(`\n⚠ In article but NOT in docs (verify by hand): ${removed.join(', ')}`);
      console.log(`\n→ Sync with the dataweave-reference-syncer subagent (verbatim; never fabricate).`);
    }
  }

  // ---- GitHub Actions plumbing ----
  let body = '';
  if (outdated) {
    body += `The [DataWeave core-functions cheatsheet](${report.article}) looks out of date vs. the live MuleSoft docs.\n\n`;
    if (versionOutdated) body += `- **New DataWeave version:** article says \`${article.version}\`, docs \`latest\` is now \`${liveVersion}\`.\n`;
    if (added.length) {
      body += `- **${added.length} Core function(s) in the docs but not in the article:**\n`;
      for (const s of added) body += `  - \`${liveFuncs.get(s).display}\` — ${liveFuncs.get(s).desc}\n`;
    }
    if (removed.length) body += `- **In the article but no longer in the docs (verify — rename/removal):** ${removed.map((r) => `\`${r}\``).join(', ')}\n`;
    body += `\n**To fix:** run the \`dataweave-reference-syncer\` subagent, which reads the docs \`.md\` endpoints verbatim, diffs, and adds only the true additions (never fabricates). See the reference-doc-sync gotcha in \`CLAUDE.md\`.\n\n`;
    body += `<sub>Opened automatically by \`scripts/check-dataweave-version.mjs\` via the \`check-dataweave-version\` workflow.</sub>`;
  }
  emitOutputs({
    outdated: String(outdated),
    article_version: article.version ?? '',
    live_version: liveVersion,
    added_count: String(added.length),
    issue_title: `DataWeave cheatsheet out of date — docs at ${liveVersion}`,
    issue_body: body,
  });
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      outdated
        ? `### ⚠ DataWeave cheatsheet out of date\n\n${body}\n`
        : `### ✓ DataWeave cheatsheet in sync\n\nArticle \`${article.version}\` matches docs \`${liveVersion}\`; no new Core functions.\n`,
    );
  }
  process.exit(0);
} catch (err) {
  console.error(`check-dataweave-version: ${err.message}`);
  // Don't open an issue on a docs outage / layout change — surface as a failed run.
  process.exit(2);
}
