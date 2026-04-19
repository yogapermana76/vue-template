import { format, parseISO, formatDistanceToNow, isValid, type Locale } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

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

export function isValidDate(date: unknown): boolean {
  if (date instanceof Date) {
    return isValid(date)
  }
  if (typeof date === 'string') {
    return isValid(parseISO(date))
  }
  return false
}

/**
 * Format date range with Indonesian month names
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Formatted string like "Agustus - Oktober 2025" or "Agustus 2025 - Januari 2026"
 */
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
