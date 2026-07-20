/**
 * Shared value shape emitted by every dynamic field renderer.
 * - `value` — human-readable string; source of truth for text-like fields.
 * - `valueId` — opaque option id; required for radio/dropdown, empty otherwise.
 */
export interface DynamicFieldValue {
  value: string
  valueId: string
}
