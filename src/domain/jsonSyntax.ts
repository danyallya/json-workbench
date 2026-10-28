export type SyntaxIssue = { position: number; line: number; column: number; message: string };

/** Deterministic JSON grammar scan; offsets and columns count UTF-16 code units. */
export function diagnoseJson(source: string): SyntaxIssue | null {
  let cursor = 0;
  const fail = (message: string): never => { throw { position: cursor, message }; };
  const space = () => { while (/[\x20\t\r\n]/.test(source[cursor] ?? '') && cursor < source.length) cursor++; };
  const string = () => {
    if (source[cursor] !== '"') fail('Expected a double-quoted string.');
    cursor++;
    while (cursor < source.length) {
      const char = source[cursor++];
      if (char === '"') return;
      if (char.charCodeAt(0) < 32) { cursor--; fail('Unescaped control character.'); }
      if (char === '\\') {
        const escape = source[cursor];
        if (escape === 'u') {
          cursor++;
          for (let digit = 0; digit < 4; digit++, cursor++) {
            if (!/[0-9a-fA-F]/.test(source[cursor] ?? '') || cursor >= source.length) fail('Expected four hexadecimal escape digits.');
          }
        } else if (escape && '"\\/bfnrt'.includes(escape)) cursor++;
        else fail('Invalid string escape.');
      }
    }
    fail('Unterminated string.');
  };
  const value = (depth = 0): void => {
    space();
    if (depth > 256) fail('Nesting exceeds the 256-level editor limit.');
    const char = source[cursor];
    if (char === '"') { string(); return; }
    if (char === '{' || char === '[') {
      const object = char === '{'; const close = object ? '}' : ']'; cursor++; space();
      if (source[cursor] === close) { cursor++; return; }
      while (true) {
        if (object) { string(); space(); if (source[cursor] !== ':') fail('Expected a colon after the property name.'); cursor++; }
        value(depth + 1); space();
        if (source[cursor] === close) { cursor++; return; }
        if (source[cursor] !== ',') fail(`Expected a comma or ${close}.`);
        cursor++; space();
      }
    }
    const token = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(source.slice(cursor));
    if (!token) fail('Expected a JSON value.');
    cursor += token![0].length;
  };
  try { value(); space(); if (cursor !== source.length) fail('Unexpected content after the JSON value.'); return null; }
  catch (issue) {
    const error = issue as { position: number; message: string };
    const before = source.slice(0, error.position);
    const lines = before.split(/\r\n|\r|\n/);
    return { ...error, line: lines.length, column: lines[lines.length - 1].length + 1 };
  }
}

export function tokenizeJson(source: string): { text: string; kind: string }[] {
  const pattern = /"(?:[^"\\]|\\.)*"\s*(?=:)|"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}[\],:]|\s+|./gs;
  return [...source.matchAll(pattern)].map(match => {
    const text = match[0];
    const key = /^"/.test(text) && /^\s*:/.test(source.slice(match.index! + text.length));
    return { text, kind: key ? 'key' : /^"/.test(text) ? 'string' : /^-?\d/.test(text) ? 'number' : /^(true|false|null)$/.test(text) ? 'literal' : 'plain' };
  });
}
