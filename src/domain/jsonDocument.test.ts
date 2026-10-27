import { describe, expect, it } from 'vitest';
import { getJsonRootSummary, parseJsonDocument } from './jsonDocument';

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
});
