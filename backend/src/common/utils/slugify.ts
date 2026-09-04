const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/**
 * Turns an arbitrary label into a URL-safe slug:
 * `"Casual T-Shirt"` -> `"casual-t-shirt"`.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
