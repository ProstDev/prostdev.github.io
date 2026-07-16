import { describe, it, expect } from 'vitest';
import { renderMarkdown, type MarkdownDoc } from './markdown-export';

// renderMarkdown is the ONE place the `.md` endpoints serialize their newline choreography, and
// its own doc-comment promises "byte-for-byte what the endpoints emitted before" — including the
// deliberate quirk that a `headerRule` divider is followed by a SINGLE newline while every
// between-section divider gets a blank line on each side. So these assert the FULL output string,
// not substrings: a stray newline is exactly the regression class this pins.

// A realistic header: at least one meta bullet (the shape every real endpoint emits). The empty-
// meta case has its own test below — it leaves a trailing newline, which would otherwise mask the
// divider assertions.
const base: MarkdownDoc = {
  title: 'Title',
  description: 'A short description.',
  meta: [{ label: 'Author', value: 'Alex' }],
};
const HEADER = '# Title\n\n> A short description.\n\n- **Author:** Alex';

describe('renderMarkdown — header block', () => {
  it('emits h1, blockquote, then the meta bullets in order', () => {
    const out = renderMarkdown({
      ...base,
      meta: [
        { label: 'Author', value: 'Alex Martinez' },
        { label: 'Read time', value: 5 },
      ],
    });
    expect(out).toBe(
      '# Title\n' +
        '\n' +
        '> A short description.\n' +
        '\n' +
        '- **Author:** Alex Martinez\n' +
        '- **Read time:** 5',
    );
  });

  it('drops falsy meta entries so callers can inline `cond ? {…} : null`', () => {
    const out = renderMarkdown({
      ...base,
      meta: [null, { label: 'Author', value: 'Alex' }, false, undefined],
    });
    expect(out).toBe('# Title\n\n> A short description.\n\n- **Author:** Alex');
  });

  it('renders header only (with a trailing newline) when meta is empty and there are no sections', () => {
    // Empty meta => the join ends on the trailing '' element, leaving one dangling newline.
    expect(renderMarkdown({ ...base, meta: [] })).toBe('# Title\n\n> A short description.\n');
  });
});

describe('renderMarkdown — headerRule (posts & skills)', () => {
  it('appends a `---` after the meta and attaches the first section with a SINGLE newline', () => {
    const out = renderMarkdown({
      ...base,
      headerRule: true,
      sections: [{ heading: 'Overview', body: 'Body text.' }],
    });
    expect(out).toBe(`${HEADER}\n\n---\n## Overview\n\nBody text.`);
  });

  it('the first section attaches with a single newline even when it sets rule:true', () => {
    // The header's own `---` already separates it; a first-section `rule` must not double it.
    const out = renderMarkdown({
      ...base,
      headerRule: true,
      sections: [{ heading: 'Overview', body: 'Body.', rule: true }],
    });
    expect(out).toBe(`${HEADER}\n\n---\n## Overview\n\nBody.`);
  });
});

describe('renderMarkdown — section dividers (videos: no headerRule)', () => {
  it('separates a first section with a blank line (no divider) when headerRule is unset', () => {
    const out = renderMarkdown({
      ...base,
      sections: [{ heading: 'Transcript', body: 'Words.' }],
    });
    expect(out).toBe(`${HEADER}\n\n## Transcript\n\nWords.`);
  });

  it('uses a blank-line `---` divider between sections when rule:true', () => {
    const out = renderMarkdown({
      ...base,
      sections: [
        { heading: 'One', body: 'First.' },
        { heading: 'Two', body: 'Second.', rule: true },
      ],
    });
    expect(out).toBe(`${HEADER}\n\n## One\n\nFirst.\n\n---\n\n## Two\n\nSecond.`);
  });

  it('joins sections with just a blank line when rule is absent', () => {
    const out = renderMarkdown({
      ...base,
      sections: [
        { heading: 'One', body: 'First.' },
        { heading: 'Two', body: 'Second.' },
      ],
    });
    expect(out).toBe(`${HEADER}\n\n## One\n\nFirst.\n\n## Two\n\nSecond.`);
  });

  it('renders a heading-less section as its raw body only (e.g. a post body block)', () => {
    const out = renderMarkdown({
      ...base,
      sections: [{ body: 'Raw markdown body, no heading.' }],
    });
    expect(out).toBe(`${HEADER}\n\nRaw markdown body, no heading.`);
  });
});
