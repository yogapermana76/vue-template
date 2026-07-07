import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { addDays, parseISO, startOfDay } from 'date-fns'
import { formatDate } from '@/utils/date'

export interface HolidayMarker {
  name: string
  startDate: string
  endDate: string
}

/** ISO date string → holiday name, built from a range of dates per holiday entry. */
export function useHolidayMap(holidays: MaybeRefOrGetter<HolidayMarker[] | undefined>) {
  const holidayMap = computed(() => {
    const map = new Map<string, string>()
    const list = toValue(holidays)
    if (!list?.length) return map

    for (const h of list) {
      let current = startOfDay(parseISO(h.startDate))
      const end = startOfDay(parseISO(h.endDate))
      // Uses date-fns format() (local time) to avoid UTC offset shifting the date.
      while (current <= end) {
        map.set(formatDate(current, 'yyyy-MM-dd'), h.name)
        current = addDays(current, 1)
      }
    }
    return map
  })

  return { holidayMap }
}
