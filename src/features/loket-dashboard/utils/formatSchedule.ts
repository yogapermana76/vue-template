import { formatDateRangeInTZ, formatTimeOfDay } from '@/utils/date'
import type { LoketSchedule } from '@/types/services/loket'

const EMPTY = '-'

export const formatScheduleDateOrDay = (schedule: LoketSchedule): string => {
  if (schedule.ScheduleCode === 'DAILY') {
    return schedule.OperationalDay ?? EMPTY
  }
  return formatDateRangeInTZ(schedule.StartDate, schedule.EndDate, schedule.Timezone) || EMPTY
}

export const formatScheduleTime = (
  time: string | null | undefined,
  timezone: string | null | undefined,
): string => formatTimeOfDay(time, timezone) || EMPTY
