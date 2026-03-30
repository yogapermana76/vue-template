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
