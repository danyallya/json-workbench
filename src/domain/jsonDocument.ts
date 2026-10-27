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
};

export type JsonParseResult =
  | { ok: true; value: JsonValue }
  | { ok: false; error: JsonParseError };

export type JsonRootSummary = {
  type: 'Object' | 'Array' | 'String' | 'Number' | 'Boolean' | 'Null';
  itemCount: number;
};

export function parseJsonDocument(source: string): JsonParseResult {
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
