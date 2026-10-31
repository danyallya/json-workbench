import { describe, expect, it } from 'vitest';
import { MAX_JSON_FILE_BYTES, safeJsonFilename, validateJsonFile } from './localJsonFile';

describe('local JSON file safeguards', () => {
  it('accepts JSON files up to the byte limit and rejects larger or non-JSON files', () => {
    expect(validateJsonFile({ name: 'settings.JSON', size: MAX_JSON_FILE_BYTES })).toBeNull();
    expect(validateJsonFile({ name: 'settings.json', size: MAX_JSON_FILE_BYTES + 1 })).toBe('too-large');
    expect(validateJsonFile({ name: 'settings.txt', size: 12 })).toBe('invalid-extension');
  });

  it('normalizes a file name to a safe JSON download name', () => {
    expect(safeJsonFilename('../release|draft.json')).toBe('release-draft.json');
    expect(safeJsonFilename('CON.json')).toBe('file-CON.json');
    expect(safeJsonFilename('  .json')).toBe('untitled.json');
    expect(safeJsonFilename(`draft${String.fromCharCode(0)}.json`)).toBe('draft.json');
  });
});
