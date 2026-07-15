import { formatCurrency } from '@/utils/currency'
import { formatDateInTZ } from '@/utils/date'

export const EMPTY = '—'

type VisitorInfoKey = 'Fullname' | 'Email' | 'PhoneNumber'

/**
 * Resolve a visitor field: prefer the value carried inside `Information[]`
 * (backend's source of truth), fall back to the top-level field. Handles
 * boolean/array/null coercion consistently with the info panel renderer.
 */
export const getVisitorField = (
  information: Array<{ label: string; value: unknown }> | undefined,
  key: VisitorInfoKey,
  fallback: string | undefined,
): string | undefined => {
  const match = information?.find(item => item.label === key)
  if (match === undefined) return fallback
  const { value } = match
  if (value === null || value === undefined || value === '') return fallback
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak'
  return String(value)
}

export const orDash = (v: unknown): string =>
  v === null || v === undefined || v === '' ? EMPTY : String(v)

export const fmtAmount = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return EMPTY
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return formatCurrency(num, 'IDR')
}

// Render UTC timestamps in the ticket's event TZ so operators see event-local time.
export const fmtDateTimeInTZ = (v: unknown, tz?: string | null): string => {
  if (!v) return EMPTY
  const base = formatDateInTZ(String(v), 'd MMM yyyy HH:mm', tz)
  if (!base) return String(v)
  return tz ? `${base} ${tz}` : base
}

// Visit window in event TZ so bare YYYY-MM-DD dates don't shift by browser TZ.
export const fmtVisitWindow = (
  startDate: string | null | undefined,
  startTime: string | null | undefined,
  endDate: string | null | undefined,
  endTime: string | null | undefined,
  tz: string | null | undefined,
): string => {
  if (!startDate || !startTime || !endDate || !endTime) return EMPTY
  try {
    const startD = formatDateInTZ(startDate, 'd MMM yyyy', tz)
    const endD = formatDateInTZ(endDate, 'd MMM yyyy', tz)
    const startT = startTime.substring(0, 5)
    const endT = endTime.substring(0, 5)
    const tzSuffix = tz ? ` ${tz}` : ''
    if (startD === endD) return `${startD} | ${startT} - ${endT}${tzSuffix}`
    return `${startD} - ${endD} | ${startT} - ${endT}${tzSuffix}`
  } catch {
    return EMPTY
  }
}
