import { onBeforeUnmount, ref, watch, type MaybeRefOrGetter, toValue } from 'vue'

export interface UseCarouselAutoplayOptions {
  /** Total number of slides (reactive-friendly). */
  total: MaybeRefOrGetter<number>
  /** Delay between auto-advances in ms. */
  delayMs?: number
  /** Skip autoplay while true (respected reactively). */
  paused?: MaybeRefOrGetter<boolean>
  /** Called when the timer wants to advance to a given index. */
  onAdvance: (nextIndex: number) => void
}

// Autoplay + navigation state for any carousel. Uses a plain setInterval to
// avoid the timing drift Swiper's Autoplay module shows with fade + loop.
// Honors `prefers-reduced-motion` — autoplay skipped for users who opt-out.
export function useCarouselAutoplay(options: UseCarouselAutoplayOptions) {
  const { delayMs = 4000, onAdvance } = options
  const activeIndex = ref(0)
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  let timerId: ReturnType<typeof setInterval> | null = null

  const stop = () => {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  const tick = () => {
    const total = toValue(options.total)
    if (total <= 1) return
    onAdvance((activeIndex.value + 1) % total)
  }

  const start = () => {
    stop()
    if (prefersReducedMotion) return
    if (toValue(options.paused) === true) return
    if (toValue(options.total) <= 1) return
    timerId = setInterval(tick, delayMs)
  }

  // Restart when total or pause state changes so the schedule stays in sync.
  watch(
    () => [toValue(options.total), toValue(options.paused)],
    () => start(),
    { immediate: false },
  )

  onBeforeUnmount(stop)

  return { activeIndex, start, stop, prefersReducedMotion }
}
