import { format, parseISO, formatDistanceToNow, isValid, type Locale } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export const DEFAULT_EVENT_TZ = 'Asia/Jakarta'

const TZ_ABBREVIATION_MAP: Record<string, string> = {
  WIB: 'Asia/Jakarta',
  WITA: 'Asia/Makassar',
  WIT: 'Asia/Jayapura',
}

export function resolveEventTimezone(tz?: string | null): string {
  if (!tz) return DEFAULT_EVENT_TZ
  const upper = tz.toUpperCase()
  return TZ_ABBREVIATION_MAP[upper] ?? tz
}

export function formatDate(
  date: Date | string,
  formatStr: string = 'dd/MM/yyyy',
  locale?: Locale,
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: locale || idLocale })
}

export function formatRelativeDate(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date

    if (!isValid(dateObj)) {
      return ''
    }

    return formatDistanceToNow(dateObj, { addSuffix: true, locale: idLocale })
  } catch {
    return ''
  }
}

export function formatDateTime(date: Date | string, locale?: Locale): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm', locale)
}

export function formatTime(date: Date | string, locale?: Locale): string {
  return formatDate(date, 'HH:mm', locale)
}

// Renders regardless of browser TZ. Supported tokens: d, MMM, yyyy, HH, mm.
export function formatDateInTZ(
  date: Date | string,
  formatStr: string = 'd MMM yyyy',
  tz?: string | null,
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: resolveEventTimezone(tz),
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(dateObj)

  const bag: Record<string, string> = {}
  for (const p of parts) bag[p.type] = p.value

  // Longer tokens replaced first so `MMM` isn't chewed by a shorter match.
  return formatStr
    .replace(/yyyy/g, bag.year ?? '')
    .replace(/MMM/g, bag.month ?? '')
    .replace(/HH/g, bag.hour ?? '')
    .replace(/mm/g, bag.minute ?? '')
    .replace(/\bd\b/g, bag.day ?? '')
}

export function isValidDate(date: unknown): boolean {
  if (date instanceof Date) {
    return isValid(date)
  }
  if (typeof date === 'string') {
    return isValid(parseISO(date))
  }
  return false
}

// "Agustus - Oktober 2025" (same year) or "Agustus 2025 - Januari 2026".
export function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = parseISO(startDate)
    const end = parseISO(endDate)

    if (!isValid(start) || !isValid(end)) {
      return ''
    }

    const startMonth = format(start, 'MMMM', { locale: idLocale })
    const endMonth = format(end, 'MMMM', { locale: idLocale })
    const startYear = format(start, 'yyyy')
    const endYear = format(end, 'yyyy')

    // Same year: "Agustus - Oktober 2025"
    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${startYear}`
    }

    // Different years: "Agustus 2025 - Januari 2026"
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
  } catch {
    return ''
  }
}

// Works on the plain object without constructing a Date — no UTC offset shifting.
export function dateValueToISO(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

// TZ-aware "d MMM yyyy — d MMM yyyy" range; collapses to one date when start = end.
// Same-year variant drops the redundant year from the start: "8 Jul — 12 Jul 2026".
export function formatDateRangeInTZ(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  tz?: string | null,
  options: { collapseSameYear?: boolean } = {},
): string {
  if (!startDate || !endDate) return ''
  const start = formatDateInTZ(startDate, 'd MMM yyyy', tz)
  const end = formatDateInTZ(endDate, 'd MMM yyyy', tz)
  if (!start || !end) return ''
  if (start === end) return start
  if (options.collapseSameYear) {
    const startYear = formatDateInTZ(startDate, 'yyyy', tz)
    const endYear = formatDateInTZ(endDate, 'yyyy', tz)
    if (startYear === endYear) {
      return `${formatDateInTZ(startDate, 'd MMM', tz)} — ${end}`
    }
  }
  return `${start} — ${end}`
}

// Trim "HH:mm:ss" → "HH:mm"; optionally suffix with a TZ label.
export function formatTimeOfDay(time: string | null | undefined, timezone?: string | null): string {
  if (!time) return ''
  const trimmed = time.length >= 5 ? time.substring(0, 5) : time
  return timezone ? `${trimmed} ${timezone}` : trimmed
}
