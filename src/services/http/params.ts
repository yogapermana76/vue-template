/**
 * Parameter helpers for HTTP requests.
 *
 * Backends generally treat `?StartDate=` (empty value) differently from omitting
 * the field entirely — and this API is one of them. `stripEmpty()` returns
 * a fresh object with all `undefined`, `null`, and empty-string values removed
 * so axios won't serialise them into the query string.
 *
 * Falsy values that are legitimately meaningful are preserved:
 * - `false` (boolean flag)
 * - `0` (numeric zero)
 */
export function stripEmpty<T extends object>(params: T): Partial<T> {
  const out = {} as Partial<T>
  for (const key in params) {
    const value = params[key]
    if (value === undefined || value === null || value === '') continue
    out[key] = value
  }
  return out
}
