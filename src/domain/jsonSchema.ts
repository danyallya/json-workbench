import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import type { JsonValue } from './jsonDocument';

export type SchemaIssue = { path: string; message: string };
export type SchemaResult = { valid: true; issues: [] } | { valid: false; issues: SchemaIssue[] };

const ajv = new Ajv({ allErrors: true, strict: false });

function formatIssue(error: ErrorObject): SchemaIssue {
  const path = error.instancePath || '/';
  if (error.keyword === 'required') {
    const property = (error.params as { missingProperty: string }).missingProperty;
    return { path: path === '/' ? `/${property}` : `${path}/${property}`, message: 'is required' };
  }
  if (error.keyword === 'additionalProperties') {
    const property = (error.params as { additionalProperty: string }).additionalProperty;
    return { path: path === '/' ? `/${property}` : `${path}/${property}`, message: 'is not allowed by this schema' };
  }
  if (error.keyword === 'type') return { path, message: `must be ${String((error.params as { type: unknown }).type)}` };
  return { path, message: error.message ?? 'does not match this schema' };
}

export function validateAgainstSchema(value: JsonValue, schemaSource: string): SchemaResult {
  let schema: unknown;
  try { schema = JSON.parse(schemaSource); }
  catch { return { valid: false, issues: [{ path: '/', message: 'Schema must be valid JSON' }] }; }
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return { valid: false, issues: [{ path: '/', message: 'Schema must be a JSON Schema object' }] };
  }
  let validator: ValidateFunction;
  try { validator = ajv.compile(schema); }
  catch { return { valid: false, issues: [{ path: '/', message: 'Schema could not be compiled; check its keywords and references' }] }; }
  if (validator(value)) return { valid: true, issues: [] };
  return { valid: false, issues: (validator.errors ?? []).map(formatIssue) };
}
