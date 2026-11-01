import { describe, expect, it } from 'vitest';
import { canFormatJsonLosslessly, getJsonRootSummary, parseJsonDocument } from './jsonDocument';

describe('Vanta JSON document parser contract', () => {
  it('parses valid nested documents into the JSON value model', () => {
    expect(parseJsonDocument('{"enabled":true,"items":[1,null]}')).toEqual({
      ok: true,
      value: { enabled: true, items: [1, null] },
    });
  });

  it('returns a normalized syntax diagnostic for invalid JSON', () => {
    const result = parseJsonDocument('{"enabled": }');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_JSON');
      expect(result.error.message).toBe('Could not parse this document. Check the JSON syntax.');
      expect(result.error.detail.length).toBeGreaterThan(0);
      expect(result.error.position === null || result.error.position >= 0).toBe(true);
    }
  });

  it('summarizes object, array, and primitive root values without assuming an object', () => {
    const object = parseJsonDocument('{"one":1,"two":2}');
    const array = parseJsonDocument('[1,2,3]');
    const primitive = parseJsonDocument('null');

    expect(object.ok && getJsonRootSummary(object.value)).toEqual({ type: 'Object', itemCount: 2 });
    expect(array.ok && getJsonRootSummary(array.value)).toEqual({ type: 'Array', itemCount: 3 });
    expect(primitive.ok && getJsonRootSummary(primitive.value)).toEqual({ type: 'Null', itemCount: 0 });
  });

  it('allows numeric tokens whose exact decimal value survives native JSON formatting', () => {
    expect(canFormatJsonLosslessly('{"safe":9007199254740991,"decimal":1.25,"exponent":1e3,"text":"9007199254740993"}')).toBe(true);
  });

  it.each(['9007199254740993', '1e400', '1e-400', '1.0000000000000001', '-0'])(
    'blocks formatting when JSON number %s would change',
    (number) => expect(canFormatJsonLosslessly(`{"value":${number}}`)).toBe(false),
  );
});
