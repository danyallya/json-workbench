import { describe, expect, it } from 'vitest';
import { validateAgainstSchema } from './jsonSchema';

describe('validateAgainstSchema', () => {
  const schema = JSON.stringify({ type: 'object', properties: { name: { type: 'string' }, count: { type: 'integer' } }, required: ['name'], additionalProperties: false });
  it('accepts matching values and reports required, type and extra-property feedback', () => {
    expect(validateAgainstSchema({ name: 'sample', count: 2 }, schema)).toEqual({ valid: true, issues: [] });
    expect(validateAgainstSchema({ count: 'two', extra: true }, schema)).toMatchObject({ valid: false, issues: expect.arrayContaining([
      { path: '/name', message: 'is required' }, { path: '/count', message: 'must be integer' }, { path: '/extra', message: 'is not allowed by this schema' },
    ]) });
  });
  it('returns readable errors for invalid schema input', () => {
    expect(validateAgainstSchema(null, '{')).toMatchObject({ issues: [{ path: '/', message: 'Schema must be valid JSON' }] });
  });
});
