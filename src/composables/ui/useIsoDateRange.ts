import { computed, type WritableComputedRef } from 'vue'
import { parseDate, type DateValue } from '@/components/ui/date-picker'

export interface IsoDateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

const safeParse = (iso: string | null): DateValue | undefined => {
  if (!iso) return undefined
  try {
    return parseDate(iso)
  } catch {
    return undefined
  }
}

// Adapts ISO date-strings ↔ DateRangePickerField's `DateValue` model.
export function useIsoDateRange(
  getStart: () => string | null,
  getEnd: () => string | null,
  setRange: (start: string | null, end: string | null) => void,
): WritableComputedRef<IsoDateRange> {
  return computed<IsoDateRange>({
    get: () => ({ start: safeParse(getStart()), end: safeParse(getEnd()) }),
    set: v => setRange(v?.start ? v.start.toString() : null, v?.end ? v.end.toString() : null),
  })
}
