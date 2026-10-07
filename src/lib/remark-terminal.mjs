// remark-terminal — render ```claude-code / ```terminal fences as animated terminal demos.
//
// Authoring (also what the `.md`/llms endpoints serve, verbatim — a plain-text script any LLM
// can read, unlike a GIF):
//     ```claude-code title="Optional window title"
//     label: claude code
//     > /rename mule-api-refactor
//       ⎿  Session renamed to: mule-api-refactor
//     label: mule-api-refactor
//     ```
// Line types:
//   • `> text` (claude-code) / `$ text` (terminal) — typed at the prompt, then "Enter".
//   • `label: …` / `status: …` (claude-code only) — set the prompt bar's top-right label / the
//     status line under the prompt bar.
//   • `color: pink` (claude-code only) — what `/color` does: tint the prompt bar's rules and turn
//     the label into a filled chip. One of COLORS; `default` (or empty) clears it.
//   • `> /btw <question>` (claude-code only) — typed like any command, but on "Enter" it opens
//     the /btw side-question panel in place of the prompt bar (spinner, then the answer) instead
//     of landing in the history. Each following `btw: …` line is a line of the answer
//     (`` `code` `` spans allowed). The next typed line closes the panel, like pressing Esc.
//   • `pause: 1.5s` / `pause: 400ms` — hold before the next step.
//   • anything else — an output line, printed instantly, whitespace kept. So is a `pause:` /
//     `color:` line whose value isn't valid, and a `btw:` line with no /btw panel open.
//   • a leading `\` forces a line to print literally (`\> not typed`, `\pause: 2s`).
//
// The server renders the FINAL frame (history + final label) as real text — the no-JS and
// reduced-motion fallback — plus the replay steps as JSON on `data-term`. TerminalPlayer.astro
// rewinds and types it out in the browser. Styling (both themes, via the semantic tokens) lives
// under the `.term*` section in src/styles/global.css. Same mdxJsxFlowElement approach as
// remark-callouts.mjs, so a `<` in a script can't break the MDX parse. Runs before Shiki (remark
// stage), so these fences never reach the highlighter or CodeBlockEnhancer.

import { visit } from 'unist-util-visit';

const STYLES = {
  'claude-code': {
    title: 'Claude Code',
    prompt: '❯',
    typed: /^[>❯](?: (.*))?$/,
    directives: ['label', 'status', 'color', 'btw', 'pause'],
    transcriptIntro: 'Animated Claude Code demo, step by step:',
  },
  terminal: {
    title: 'Terminal',
    prompt: '$',
    typed: /^\$(?: (.*))?$/,
    directives: ['pause'],
    transcriptIntro: 'Animated terminal demo, step by step:',
  },
};

const DIRECTIVE = /^(label|status|color|btw|pause):(.*)$/;
// A typed `/btw <question>` (a bare `/btw` stays an ordinary command).
const BTW = /^\/btw\s+(\S.*)$/;
const INLINE_CODE = /`([^`]+)`/g;
// Claude Code's `/color` options. Each maps to a theme-aware --term-color-* token in global.css.
export const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
const DURATION = /^(\d+(?:\.\d+)?)\s*(ms|s)?$/;
// Same meta syntax as shiki-code-title.mjs — `title="…"` or `title='…'`.
const TITLE_RE = /\btitle=(?:"([^"]*)"|'([^']*)')/;
// Box-drawing glyphs, reply bullets, and spinners Claude Code prefixes output with (`⎿`, `●`,
// `✻`) — noise when read aloud.
const LEADING_GLYPHS = /^[\s⎿│└├─╰●⏺✻]+/u;

/** Split a /btw answer line into plain and `code` parts (an unpaired backtick stays literal). */
function inlineParts(text) {
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_CODE)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[1], code: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** `1.5s` → 1500, `400ms` → 400, bare `2` → 2000 (seconds). Anything else → null. */
function parseDuration(value) {
  const m = value.match(DURATION);
  if (!m) return null;
  return Math.round(Number(m[1]) * (m[2] === 'ms' ? 1 : 1000));
}

/**
 * Parse a terminal-demo script. Pure — the contract between the post and TerminalPlayer.astro:
 *   lines      — the final screen history, in order ({ kind: 'cmd' | 'out', text })
 *   steps      — how to replay it: type / out / label / status / color / btw / btw-answer /
 *                btw-close / pause
 *   initial    — label + status + color in effect before the first visible step (the first frame)
 *   final      — label + status + color at the end (the server-rendered frame)
 *   btw        — the /btw panel still open at the end ({ question, answer }), or null
 *   transcript — plain sentences for screen readers (the animated screen is aria-hidden)
 */
export function parseTerminalScript(source, style) {
  const cfg = STYLES[style];
  const lines = [];
  const steps = [];
  const transcript = [];
  let label = '';
  let status = '';
  let color = ''; // '' = default (uncolored)
  let btw = null; // the open /btw panel: { question, answer: [parts, …] }
  let initial = null;

  // The first frame is whatever label/status/color is set before anything appears on screen.
  const startVisible = () => {
    if (!initial) initial = { label, status, color };
  };
  const output = (text) => {
    startVisible();
    lines.push({ kind: 'out', text });
    steps.push({ t: 'out', line: lines.length - 1 });
    const spoken = text.replace(LEADING_GLYPHS, '').trim();
    if (spoken) transcript.push(`Output: ${spoken}`);
  };

  for (const raw of source.split(/\r?\n/)) {
    if (raw.startsWith('\\')) {
      output(raw.slice(1));
      continue;
    }

    const d = raw.match(DIRECTIVE);
    if (d && cfg.directives.includes(d[1])) {
      const value = d[2].trim();
      if (d[1] === 'pause') {
        const ms = parseDuration(value);
        if (ms !== null) {
          steps.push({ t: 'pause', ms });
          continue;
        }
        // Not a duration — fall through and print it as output.
      } else if (d[1] === 'color') {
        const next = value === 'default' ? '' : value;
        if (next === '' || COLORS.includes(next)) {
          if (initial) {
            transcript.push(next ? `Prompt bar color changes to: ${next}` : 'Prompt bar color resets to default');
            steps.push({ t: 'color', color: next });
          } else if (next) {
            transcript.push(`Prompt bar color: ${next}`);
          }
          color = next;
          continue;
        }
        // Not a /color option — fall through and print it as output.
      } else if (d[1] === 'btw') {
        if (btw) {
          const parts = inlineParts(value);
          btw.answer.push(parts);
          steps.push({ t: 'btw-answer', parts });
          if (value) transcript.push(`Side answer (not added to the conversation): ${parts.map((p) => p.text).join('')}`);
          continue;
        }
        // No /btw panel open — fall through and print it as output.
      } else {
        const what = d[1] === 'label' ? 'Prompt bar label' : 'Status line';
        if (value) transcript.push(initial ? `${what} changes to: ${value}` : `${what}: ${value}`);
        if (d[1] === 'label') label = value;
        else status = value;
        if (initial) steps.push({ t: d[1], text: value });
        continue;
      }
    }

    const typed = raw.match(cfg.typed);
    if (typed) {
      startVisible();
      const text = typed[1] ?? '';
      // The /btw panel holds the input until it's dismissed, so typing again means Esc first.
      if (btw) {
        steps.push({ t: 'btw-close' });
        transcript.push('You close the side answer');
        btw = null;
      }
      const side = cfg.directives.includes('btw') && text.match(BTW);
      if (side) {
        // Typed at the prompt, but it opens the panel instead of entering the history.
        steps.push({ t: 'type', text });
        steps.push({ t: 'btw', question: side[1] });
        transcript.push(`You type: ${text}`);
        btw = { question: side[1], answer: [] };
        continue;
      }
      lines.push({ kind: 'cmd', text });
      steps.push({ t: 'type', text, line: lines.length - 1 });
      if (text) transcript.push(`You type: ${text}`);
      continue;
    }

    output(raw);
  }

  return {
    title: cfg.title,
    prompt: cfg.prompt,
    transcriptIntro: cfg.transcriptIntro,
    initial: initial ?? { label, status, color },
    final: { label, status, color },
    btw,
    lines,
    steps,
    transcript,
  };
}

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });
const el = (name, attrs, children = []) => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: Object.entries(attrs).map(([k, v]) => attr(k, v)),
  children,
});
const text = (value) => ({ type: 'text', value });
// Empty text → no child at all, so `:empty` CSS (hidden label / status) matches.
const textChildren = (value) => (value ? [text(value)] : []);
// One /btw answer line. A <span>, not <code>: the global `.prose :where(code)` chip rule
// doesn't honor `not-prose`. TerminalPlayer builds the same markup when it replays a line.
const btwLine = (parts) =>
  el(
    'div',
    { class: 'term__btw-line' },
    parts.map((p) => el('span', p.code ? { class: 'term__code' } : {}, [text(p.text)]))
  );

// The /btw side-question panel. It takes the prompt bar's place while open (`data-btw` on
// .term__promptbar: `answering` shows the spinner, `answered` the answer), like Claude Code's.
function buildBtwPanel(btw) {
  return el('div', { class: 'term__btw' }, [
    el('div', { class: 'term__rule' }),
    el('div', { class: 'term__btw-body' }, [
      el('div', { class: 'term__btw-q' }, [
        el('span', { class: 'term__btw-cmd' }, [text('/btw ')]),
        el('span', { class: 'term__btw-question' }, textChildren(btw?.question ?? '')),
      ]),
      el('div', { class: 'term__btw-spinner' }, [
        el('span', { class: 'term__btw-glyph' }), // the glyph is CSS (::before), so it can cycle
        text('Answering…'),
      ]),
      el('div', { class: 'term__btw-answer' }, (btw?.answer ?? []).map(btwLine)),
      el('div', { class: 'term__btw-hint term__btw-hint--answering' }, [text('Esc to close')]),
      el('div', { class: 'term__btw-hint term__btw-hint--answered' }, [
        text('↑/↓ to scroll · c to copy · f to fork · Esc to close'),
      ]),
    ]),
  ]);
}

function buildFigure(script, style, title) {
  // The prompt + its trailing space share one text node so MDX can't drop the space as
  // inter-element whitespace.
  const prompt = () => el('span', { class: 'term__prompt' }, [text(`${script.prompt} `)]);

  const history = el(
    'div',
    { class: 'term__history' },
    script.lines.map((line) =>
      el(
        'div',
        { class: `term__line term__line--${line.kind}` },
        line.kind === 'cmd' ? [prompt(), ...textChildren(line.text)] : textChildren(line.text)
      )
    )
  );

  const input = el('div', { class: 'term__input' }, [
    prompt(),
    el('span', { class: 'term__typed' }),
    el('span', { class: 'term__cursor' }),
  ]);

  // claude-code wraps the input in Claude Code's prompt bar: a rule with the session label at
  // its right end, the input, a plain rule, then the optional status line, plus the /btw panel
  // when the script uses one. `data-color` (the `/color` tint) and `data-btw` (panel open) are
  // only set when they apply, so CSS can key off `[data-color]` / `[data-btw]`.
  const usesBtw = script.steps.some((step) => step.t === 'btw');
  const btwState = script.btw && (script.btw.answer.length ? 'answered' : 'answering');
  const inputArea =
    style === 'claude-code'
      ? el(
          'div',
          {
            class: 'term__promptbar',
            ...(script.final.color && { 'data-color': script.final.color }),
            ...(btwState && { 'data-btw': btwState }),
          },
          [
            el('div', { class: 'term__rule' }, [
              el('span', { class: 'term__label' }, textChildren(script.final.label)),
            ]),
            input,
            el('div', { class: 'term__rule' }),
            el('div', { class: 'term__status' }, textChildren(script.final.status)),
            ...(usesBtw ? [buildBtwPanel(script.btw)] : []),
          ]
        )
      : input;

  const bar = el('div', { class: 'term__bar' }, [
    el('span', { class: 'term__dots', 'aria-hidden': 'true' }, [
      el('span', {}),
      el('span', {}),
      el('span', {}),
    ]),
    el('span', { class: 'term__title', 'aria-hidden': 'true' }, [text(title || script.title)]),
  ]);

  // The animated screen is aria-hidden + left out of the search index; screen readers and
  // Pagefind get the plain-sentence transcript instead (the figcaption).
  const screen = el(
    'div',
    { class: 'term__screen', 'aria-hidden': 'true', 'data-pagefind-ignore': 'all' },
    [history, inputArea]
  );

  const caption = el('figcaption', { class: 'sr-only' }, [
    el('span', {}, [text(script.transcriptIntro)]),
    el(
      'ol',
      {},
      script.transcript.map((sentence) => el('li', {}, [text(sentence)]))
    ),
  ]);

  return el(
    'figure',
    {
      class: `term term--${style} not-prose`,
      'data-term': JSON.stringify({
        label: script.initial.label,
        status: script.initial.status,
        color: script.initial.color,
        steps: script.steps,
      }),
    },
    [bar, screen, caption]
  );
}

export default function remarkTerminal() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === undefined || !node.lang || !Object.hasOwn(STYLES, node.lang)) return;
      const m = node.meta?.match(TITLE_RE);
      const title = m ? (m[1] ?? m[2]) : '';
      const script = parseTerminalScript(node.value, node.lang);
      parent.children[index] = buildFigure(script, node.lang, title);
    });
  };
}
