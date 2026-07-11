import { formatDate } from '@/utils/date'
import type { LoketScanTicketItem } from '@/types/services/loket'

export const formatPhone = (raw: string | undefined | null): string => {
  if (!raw) return '—'
  const digits = raw.replace(/\D/g, '')
  let national = digits
  if (digits.startsWith('62')) national = digits.slice(2)
  else if (digits.startsWith('0')) national = digits.slice(1)
  if (national.length < 9 || national.length > 12) return raw
  const first = national.slice(0, 3)
  const rest = national
    .slice(3)
    .replace(/(.{4})/g, '$1-')
    .replace(/-$/, '')
  return `+62 ${first}-${rest}`
}

export const formatVisit = (t: LoketScanTicketItem): string | null => {
  if (!t.StartVisitDate || !t.StartVisitTime || !t.EndVisitDate || !t.EndVisitTime) return null
  try {
    const startDate = formatDate(t.StartVisitDate, 'd MMM yyyy')
    const endDate = formatDate(t.EndVisitDate, 'd MMM yyyy')
    const startTime = t.StartVisitTime.substring(0, 5)
    const endTime = t.EndVisitTime.substring(0, 5)
    const range = `${startTime}–${endTime}`
    return startDate === endDate ? `${startDate} · ${range}` : `${startDate}–${endDate} · ${range}`
  } catch {
    return null
  }
}

export const formatOrderDate = (raw: string | undefined | null): string => {
  if (!raw) return '—'
  try {
    return formatDate(raw, 'd MMM yyyy · HH:mm')
  } catch {
    return raw
  }
}
