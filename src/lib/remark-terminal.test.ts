import { describe, it, expect } from 'vitest';
import { parseTerminalScript } from './remark-terminal.mjs';

// parseTerminalScript() is the contract between a post's ```claude-code / ```terminal fence and
// TerminalPlayer.astro: `lines` is the server-rendered final frame, `steps` replays it, and
// `transcript` is what screen readers get. These tests pin that shape.

describe('parseTerminalScript — claude-code', () => {
  const script = parseTerminalScript(
    [
      'label: claude code',
      '> /rename mule-api-refactor',
      '  ⎿  Session renamed to: mule-api-refactor',
      'pause: 1.5s',
      'label: mule-api-refactor',
    ].join('\n'),
    'claude-code'
  );

  it('splits typed commands from output, keeping output indentation', () => {
    expect(script.lines).toEqual([
      { kind: 'cmd', text: '/rename mule-api-refactor' },
      { kind: 'out', text: '  ⎿  Session renamed to: mule-api-refactor' },
    ]);
  });

  it('starts on the label set before anything appears, and ends on the last one', () => {
    expect(script.initial).toEqual({ label: 'claude code', status: '', color: '' });
    expect(script.final).toEqual({ label: 'mule-api-refactor', status: '', color: '' });
  });

  it('replays in order, without a step for the initial label', () => {
    expect(script.steps).toEqual([
      { t: 'type', text: '/rename mule-api-refactor', line: 0 },
      { t: 'out', line: 1 },
      { t: 'pause', ms: 1500 },
      { t: 'label', text: 'mule-api-refactor' },
    ]);
  });

  it('describes the demo in plain sentences, minus the ⎿ glyph', () => {
    expect(script.transcript).toEqual([
      'Prompt bar label: claude code',
      'You type: /rename mule-api-refactor',
      'Output: Session renamed to: mule-api-refactor',
      'Prompt bar label changes to: mule-api-refactor',
    ]);
  });

  it('uses the ❯ prompt and accepts ❯ as well as > for typed lines', () => {
    const s = parseTerminalScript('❯ /color purple', 'claude-code');
    expect(s.prompt).toBe('❯');
    expect(s.lines).toEqual([{ kind: 'cmd', text: '/color purple' }]);
  });
});

describe('parseTerminalScript — directives and escapes', () => {
  it('parses ms, s, and bare-second pauses', () => {
    const s = parseTerminalScript('pause: 400ms\npause: 2s\npause: 1', 'terminal');
    expect(s.steps).toEqual([
      { t: 'pause', ms: 400 },
      { t: 'pause', ms: 2000 },
      { t: 'pause', ms: 1000 },
    ]);
  });

  it('prints a pause line with no valid duration as output instead of dropping it', () => {
    const s = parseTerminalScript('pause: whenever', 'terminal');
    expect(s.lines).toEqual([{ kind: 'out', text: 'pause: whenever' }]);
  });

  it('prints a backslash-escaped line literally', () => {
    const s = parseTerminalScript('\\> not typed\n\\pause: 2s', 'claude-code');
    expect(s.lines).toEqual([
      { kind: 'out', text: '> not typed' },
      { kind: 'out', text: 'pause: 2s' },
    ]);
    expect(s.steps.every((step) => step.t === 'out')).toBe(true);
  });

  it('tracks the /color tint, with default clearing it', () => {
    const s = parseTerminalScript(
      'color: pink\n> /color cyan\ncolor: cyan\n> /color default\ncolor: default',
      'claude-code'
    );
    expect(s.initial.color).toBe('pink');
    expect(s.final.color).toBe('');
    expect(s.steps.filter((step) => step.t === 'color')).toEqual([
      { t: 'color', color: 'cyan' },
      { t: 'color', color: '' },
    ]);
    expect(s.transcript).toEqual([
      'Prompt bar color: pink',
      'You type: /color cyan',
      'Prompt bar color changes to: cyan',
      'You type: /color default',
      'Prompt bar color resets to default',
    ]);
  });

  it('prints a color line that is not a /color option as output', () => {
    const s = parseTerminalScript('color: chartreuse', 'claude-code');
    expect(s.lines).toEqual([{ kind: 'out', text: 'color: chartreuse' }]);
    expect(s.final.color).toBe('');
  });

  it('tracks the status line like the label', () => {
    const s = parseTerminalScript('status: auto mode on\n> hi\nstatus: plan mode on', 'claude-code');
    expect(s.initial.status).toBe('auto mode on');
    expect(s.final.status).toBe('plan mode on');
    expect(s.steps.at(-1)).toEqual({ t: 'status', text: 'plan mode on' });
  });
});

describe('parseTerminalScript — /btw panel', () => {
  const s = parseTerminalScript(
    [
      '> refactor the flows',
      '● On it.',
      '> /btw which port?',
      'btw: `8081`, from `http.port`.',
    ].join('\n'),
    'claude-code'
  );

  it('keeps the side question and answer out of the history', () => {
    expect(s.lines).toEqual([
      { kind: 'cmd', text: 'refactor the flows' },
      { kind: 'out', text: '● On it.' },
    ]);
  });

  it('types the question, opens the panel, then fills in the answer with code spans', () => {
    expect(s.steps.slice(2)).toEqual([
      { t: 'type', text: '/btw which port?' },
      { t: 'btw', question: 'which port?' },
      {
        t: 'btw-answer',
        parts: [{ text: '8081', code: true }, { text: ', from ' }, { text: 'http.port', code: true }, { text: '.' }],
      },
    ]);
    expect(s.btw).toEqual({ question: 'which port?', answer: [s.steps.at(-1).parts] });
  });

  it('says the answer stays out of the conversation, minus the reply bullet', () => {
    expect(s.transcript).toEqual([
      'You type: refactor the flows',
      'Output: On it.',
      'You type: /btw which port?',
      'Side answer (not added to the conversation): 8081, from http.port.',
    ]);
  });

  it('closes the panel when the next line is typed', () => {
    const t = parseTerminalScript('> /btw why?\nbtw: because.\n> next', 'claude-code');
    expect(t.btw).toBeNull();
    expect(t.steps.map((step) => step.t)).toEqual(['type', 'btw', 'btw-answer', 'btw-close', 'type']);
    expect(t.lines).toEqual([{ kind: 'cmd', text: 'next' }]);
  });

  it('prints a btw line with no panel open as output, and leaves a bare /btw a command', () => {
    const t = parseTerminalScript('btw: stray\n> /btw', 'claude-code');
    expect(t.lines).toEqual([
      { kind: 'out', text: 'btw: stray' },
      { kind: 'cmd', text: '/btw' },
    ]);
    expect(t.btw).toBeNull();
  });

  it('is claude-code only', () => {
    const t = parseTerminalScript('$ /btw hi\nbtw: no', 'terminal');
    expect(t.lines).toEqual([
      { kind: 'cmd', text: '/btw hi' },
      { kind: 'out', text: 'btw: no' },
    ]);
  });
});

describe('parseTerminalScript — terminal', () => {
  const s = parseTerminalScript('$ npm run build\nbuilt in 2.1s', 'terminal');

  it('types $ lines at a $ prompt', () => {
    expect(s.prompt).toBe('$');
    expect(s.lines).toEqual([
      { kind: 'cmd', text: 'npm run build' },
      { kind: 'out', text: 'built in 2.1s' },
    ]);
  });

  it('has no label/status/color directives, so those lines are plain output', () => {
    const t = parseTerminalScript('label: not a directive here\ncolor: pink', 'terminal');
    expect(t.lines).toEqual([
      { kind: 'out', text: 'label: not a directive here' },
      { kind: 'out', text: 'color: pink' },
    ]);
  });

  it('treats a > line as output, not a command', () => {
    const t = parseTerminalScript('> quoted', 'terminal');
    expect(t.lines).toEqual([{ kind: 'out', text: '> quoted' }]);
  });
});
