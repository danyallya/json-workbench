import { diagnoseJson } from './jsonSyntax';
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;

export type JsonDocument = {
  id: string;
  name: string;
  source: string;
};

export type JsonParseError = {
  code: 'INVALID_JSON';
  message: string;
  detail: string;
  position: number | null;
  line: number;
  column: number;
};

export type JsonParseResult =
  | { ok: true; value: JsonValue }
  | { ok: false; error: JsonParseError };

export type JsonRootSummary = {
  type: 'Object' | 'Array' | 'String' | 'Number' | 'Boolean' | 'Null';
  itemCount: number;
};

const jsonNumberPattern = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

function normalizeDecimal(value: string): string | null {
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(value);
  if (!match) return null;
  const sign = match[1];
  const fraction = match[3] ?? '';
  let digits = `${match[2]}${fraction}`.replace(/^0+/, '');
  if (!digits) return sign ? '-0' : '0';
  const trailingZeros = /0+$/.exec(digits)?.[0].length ?? 0;
  if (trailingZeros) digits = digits.slice(0, -trailingZeros);
  const exponentText = match[4] ?? '0';
  if (exponentText.replace(/^[+-]?0*/, '').length > 5) return null;
  const exponent = Number(exponentText) - fraction.length + trailingZeros;
  if (!Number.isSafeInteger(exponent)) return null;
  return `${sign}${digits}e${exponent}`;
}

/** True when JSON.parse followed by JSON.stringify would preserve every numeric value. */
export function canFormatJsonLosslessly(source: string): boolean {
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
      continue;
    }
    if (character !== '-' && (character < '0' || character > '9')) continue;

    jsonNumberPattern.lastIndex = index;
    const token = jsonNumberPattern.exec(source)?.[0];
    if (!token) continue;
    const parsed = Number(token);
    if (!Number.isFinite(parsed) || (Object.is(parsed, -0) && token.startsWith('-'))) return false;
    if (normalizeDecimal(token) !== normalizeDecimal(parsed.toString())) return false;
    index += token.length - 1;
  }
  return true;
}

export function parseJsonDocument(source: string): JsonParseResult {
  const issue = diagnoseJson(source);
  if (issue) return { ok: false, error: {
    code: 'INVALID_JSON', message: 'Could not parse this document. Check the JSON syntax.',
    detail: issue.message, position: issue.position, line: issue.line, column: issue.column,
  } };
  try {
    return { ok: true, value: JSON.parse(source) as JsonValue };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown JSON parser error.';
    const positionMatch = /position\s+(\d+)/i.exec(detail);

    return {
      ok: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Could not parse this document. Check the JSON syntax.',
        detail,
        position: positionMatch ? Number(positionMatch[1]) : null,
        line: 1,
        column: 1,
      },
    };
  }
}

export function getJsonRootSummary(value: JsonValue): JsonRootSummary {
  if (value === null) return { type: 'Null', itemCount: 0 };
  if (Array.isArray(value)) return { type: 'Array', itemCount: value.length };
  if (typeof value === 'object') return { type: 'Object', itemCount: Object.keys(value).length };
  if (typeof value === 'string') return { type: 'String', itemCount: 0 };
  if (typeof value === 'number') return { type: 'Number', itemCount: 0 };
  return { type: 'Boolean', itemCount: 0 };
}
