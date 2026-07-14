import { formatDate } from '@/utils/date'
import type { ScanTicketItem } from '@/types/services'

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

/**
 * Pick the date/time window to display. For racepack tickets the pickup
 * window (RacepackData.StartDate/EndDate + OpenTime/CloseTime) supersedes
 * the visit window — otherwise the ticket's StartVisit/EndVisit is used.
 */
interface VisitWindow {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone?: string
}

const pickVisitWindow = (t: ScanTicketItem, orderTz?: string): VisitWindow | null => {
  const rp = t.RacepackData
  if (rp?.StartDate && rp.EndDate && rp.OpenTime && rp.CloseTime) {
    // Racepack carries its own timezone (pickup city may differ from event city).
    return {
      startDate: rp.StartDate,
      endDate: rp.EndDate,
      startTime: rp.OpenTime,
      endTime: rp.CloseTime,
      timezone: rp.Timezone,
    }
  }
  if (t.StartVisitDate && t.EndVisitDate && t.StartVisitTime && t.EndVisitTime) {
    // Visit window inherits the order's timezone — ScanTicketItem itself
    // doesn't carry one because the whole order shares it.
    return {
      startDate: t.StartVisitDate,
      endDate: t.EndVisitDate,
      startTime: t.StartVisitTime,
      endTime: t.EndVisitTime,
      timezone: orderTz,
    }
  }
  return null
}

export const formatVisit = (t: ScanTicketItem, orderTz?: string): string | null => {
  const window = pickVisitWindow(t, orderTz)
  if (!window) return null
  try {
    const startDate = formatDate(window.startDate, 'd MMM yyyy')
    const endDate = formatDate(window.endDate, 'd MMM yyyy')
    const startTime = window.startTime.substring(0, 5)
    const endTime = window.endTime.substring(0, 5)
    const tz = window.timezone ? ` ${window.timezone}` : ''
    const range = `${startTime}–${endTime}${tz}`
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
