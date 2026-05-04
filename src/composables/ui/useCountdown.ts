import { shallowRef, watch, onScopeDispose, type MaybeRefOrGetter, toValue } from 'vue'

export interface UseCountdownOptions {
  /** Callback when countdown expires */
  onExpire?: () => void
  /** Update interval in ms (default: 1000) */
  interval?: number
  /** Auto start countdown (default: true) */
  immediate?: boolean
}

export interface UseCountdownReturn {
  /** Formatted countdown string (HH:MM:SS) */
  display: Readonly<ReturnType<typeof shallowRef<string | null>>>
  /** Remaining time in milliseconds */
  remaining: Readonly<ReturnType<typeof shallowRef<number>>>
  /** Whether countdown is running */
  isRunning: Readonly<ReturnType<typeof shallowRef<boolean>>>
  /** Whether countdown has expired */
  isExpired: Readonly<ReturnType<typeof shallowRef<boolean>>>
  /** Start the countdown */
  start: () => void
  /** Stop the countdown */
  stop: () => void
  /** Reset the countdown */
  reset: () => void
}

/**
 * Composable for countdown timer with HH:MM:SS format
 *
 * @param deadline - Target deadline as ISO string, Unix timestamp (ms), or Date
 * @param options - Configuration options
 *
 * @example
 * ```ts
 * const { display, isExpired } = useCountdown(
 *   () => props.deadline,
 *   { onExpire: () => emit('expired') }
 * )
 * ```
 */
export function useCountdown(
  deadline: MaybeRefOrGetter<string | number | Date | null | undefined>,
  options: UseCountdownOptions = {},
): UseCountdownReturn {
  const { onExpire, interval = 1000, immediate = true } = options

  const display = shallowRef<string | null>(null)
  const remaining = shallowRef(0)
  const isRunning = shallowRef(false)
  const isExpired = shallowRef(false)

  let intervalId: ReturnType<typeof setInterval> | null = null

  const formatTime = (ms: number): string => {
    if (ms <= 0) return '00:00:00'

    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getDeadlineMs = (value: string | number | Date | null | undefined): number | null => {
    if (value == null) return null

    if (value instanceof Date) {
      return value.getTime()
    }
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'string') {
      const parsed = new Date(value).getTime()
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  }

  const update = () => {
    const deadlineValue = toValue(deadline)
    const deadlineMs = getDeadlineMs(deadlineValue)

    if (deadlineMs === null) {
      display.value = null
      remaining.value = 0
      return
    }

    const now = Date.now()
    const diff = deadlineMs - now

    if (diff <= 0) {
      remaining.value = 0
      display.value = '00:00:00'
      isExpired.value = true
      stop()
      onExpire?.()
      return
    }

    remaining.value = diff
    display.value = formatTime(diff)
  }

  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  const start = () => {
    const deadlineValue = toValue(deadline)
    if (deadlineValue == null) return

    stop()
    isExpired.value = false
    update()

    if (remaining.value > 0) {
      intervalId = setInterval(update, interval)
      isRunning.value = true
    }
  }

  const reset = () => {
    stop()
    isExpired.value = false
    display.value = null
    remaining.value = 0

    if (immediate) {
      start()
    }
  }

  // Watch for deadline changes
  watch(
    () => toValue(deadline),
    newDeadline => {
      if (newDeadline != null) {
        start()
      } else {
        stop()
        display.value = null
        remaining.value = 0
        isExpired.value = false
      }
    },
    { immediate },
  )

  // Cleanup on scope dispose
  onScopeDispose(stop)

  return {
    display,
    remaining,
    isRunning,
    isExpired,
    start,
    stop,
    reset,
  }
}
