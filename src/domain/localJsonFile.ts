export const MAX_JSON_FILE_BYTES = 1024 * 1024;

export type JsonFileIssue = 'invalid-extension' | 'too-large';

export function validateJsonFile(file: Pick<File, 'name' | 'size'>): JsonFileIssue | null {
  if (!file.name.toLowerCase().endsWith('.json')) return 'invalid-extension';
  if (file.size > MAX_JSON_FILE_BYTES) return 'too-large';
  return null;
}

export function safeJsonFilename(filename: string): string {
  const basename = filename.split(/[\\/]/).pop() ?? '';
  const withoutExtension = basename.replace(/\.json$/i, '');
  let safeName = withoutExtension
    .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/[<>:"/\\|?*]/g, '-')
    .trim()
    .replace(/^[. ]+|[. ]+$/g, '')
    .slice(0, 96)
    .replace(/[. ]+$/g, '');

  if (!safeName) safeName = 'untitled';
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(safeName)) safeName = `file-${safeName}`;
  return `${safeName}.json`;
}
