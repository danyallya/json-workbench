import { describe, expect, it } from 'vitest';
import { diagnoseJson, tokenizeJson } from './jsonSyntax';
import { parseJsonDocument } from './jsonDocument';

describe('stable JSON locations and safe tokens', () => {
  it.each([
    ['', 0, 1, 1], ['{\n "x": }', 8, 2, 7], ['[1,]', 3, 1, 4],
    ['{\r\n"x":}', 7, 2, 5], ['true false', 5, 1, 6], ['"abc', 4, 1, 5],
    ['01', 1, 1, 2], ['"\\q"', 2, 1, 3],
  ])('locates invalid source %j', (source, position, line, column) => {
    expect(diagnoseJson(source as string)).toMatchObject({ position, line, column });
  });
  it.each(['null', '-1.2e+3', '{"a":[true,false,null,"\\u0041"]}', '"</script>"', '\r\n { } '])('accepts valid JSON %s', source => {
    expect(diagnoseJson(source)).toBeNull();
    expect(parseJsonDocument(source).ok).toBe(true);
  });
  it('keeps all source text including markup and whitespace as text tokens', () => {
    const source = '{ "html": "<img onerror=alert(1)>", "count": 2, "ok":true }';
    const tokens = tokenizeJson(source);
    expect(tokens.map(token => token.text).join('')).toBe(source);
    expect(tokens.some(token => token.kind === 'key')).toBe(true);
    expect(tokens.some(token => token.kind === 'number')).toBe(true);
  });
  it('rejects excessive nesting without a stack overflow', () => {
    expect(diagnoseJson('['.repeat(300))).toMatchObject({ message: 'Nesting exceeds the 256-level editor limit.' });
  });
});
