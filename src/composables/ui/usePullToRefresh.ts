import { ref, computed, toValue, onMounted, onUnmounted, type MaybeRefOrGetter } from 'vue'

/** Default overlay selectors for pull-to-refresh detection */
const DEFAULT_OVERLAY_SELECTORS = [
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[data-state="open"][data-vaul-drawer]',
  '[data-radix-dialog-content]',
  '[data-radix-alert-dialog-content]',
  '.modal',
  '.drawer',
  '.bottom-sheet',
] as const

export interface UsePullToRefreshOptions {
  /**
   * The element to attach the pull-to-refresh behavior
   * If not provided, uses document
   */
  containerRef?: MaybeRefOrGetter<HTMLElement | null>
  /**
   * Minimum pull distance to trigger refresh (in pixels)
   * @default 80
   */
  threshold?: number
  /**
   * Maximum pull distance (in pixels)
   * @default 120
   */
  maxPull?: number
  /**
   * Resistance factor for pull gesture (0-1, lower = more resistance)
   * @default 0.5
   */
  resistance?: number
  /**
   * Callback function when refresh is triggered
   */
  onRefresh: () => Promise<void>
  /**
   * Whether pull-to-refresh is enabled (reactive)
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Additional overlay selectors to ignore pull gestures
   */
  overlaySelectors?: string[]
}

export function usePullToRefresh(options: UsePullToRefreshOptions) {
  const {
    threshold = 80,
    maxPull = 120,
    resistance = 0.5,
    onRefresh,
    overlaySelectors = [],
  } = options

  // Reactive state
  const isRefreshing = ref(false)
  const pullDistance = ref(0)
  const isPulling = ref(false)

  // Touch tracking (encapsulated in object for cleaner reset)
  const touchState = {
    startY: 0,
    currentY: 0,
    target: null as EventTarget | null,
  }

  // Merge default and custom overlay selectors
  const allOverlaySelectors = [...DEFAULT_OVERLAY_SELECTORS, ...overlaySelectors]

  /**
   * Check if touch event originates from inside an overlay
   */
  const isInsideOverlay = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false
    return allOverlaySelectors.some(selector => target.closest(selector))
  }

  /**
   * Check if element is scrollable
   */
  const isScrollableElement = (element: Element): boolean => {
    const style = window.getComputedStyle(element)
    return style.overflowY === 'auto' || style.overflowY === 'scroll'
  }

  /**
   * Check if any scrollable parent is not at top
   */
  const isAnyParentScrolled = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false

    let element: Element | null = target

    while (element && element !== document.documentElement) {
      if (isScrollableElement(element) && element.scrollTop > 0) {
        return true
      }
      element = element.parentElement
    }

    return false
  }

  /**
   * Determine if pull gesture can be initiated
   */
  const canPull = (target?: EventTarget | null): boolean => {
    if (!toValue(options.enabled ?? true)) return false
    if (isRefreshing.value) return false
    if (target && isAnyParentScrolled(target)) return false

    const container = toValue(options.containerRef) || document.documentElement
    return container.scrollTop <= 0
  }

  /**
   * Reset touch state to initial values
   */
  const resetTouchState = () => {
    touchState.startY = 0
    touchState.currentY = 0
    touchState.target = null
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (isInsideOverlay(e.target)) return
    if (!canPull(e.target)) return

    touchState.target = e.target
    touchState.startY = e.touches[0].clientY
    isPulling.value = true
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.value || !canPull(touchState.target)) return

    touchState.currentY = e.touches[0].clientY
    const diff = touchState.currentY - touchState.startY

    if (diff > 0) {
      pullDistance.value = Math.min(diff * resistance, maxPull)

      if (pullDistance.value > 0) {
        e.preventDefault()
      }
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.value) return

    isPulling.value = false

    if (pullDistance.value >= threshold) {
      isRefreshing.value = true
      // Keep indicator visible at reduced height during refresh
      pullDistance.value = threshold * 0.6

      try {
        await onRefresh()
      } finally {
        isRefreshing.value = false
        pullDistance.value = 0
      }
    } else {
      pullDistance.value = 0
    }

    resetTouchState()
  }

  const handleTouchCancel = () => {
    isPulling.value = false
    pullDistance.value = 0
    resetTouchState()
  }

  const setupListeners = () => {
    const container = toValue(options.containerRef) || document

    container.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true })
    container.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false })
    container.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true })
    container.addEventListener('touchcancel', handleTouchCancel as EventListener, { passive: true })
  }

  const removeListeners = () => {
    const container = toValue(options.containerRef) || document

    container.removeEventListener('touchstart', handleTouchStart as EventListener)
    container.removeEventListener('touchmove', handleTouchMove as EventListener)
    container.removeEventListener('touchend', handleTouchEnd as EventListener)
    container.removeEventListener('touchcancel', handleTouchCancel as EventListener)
  }

  onMounted(setupListeners)
  onUnmounted(removeListeners)

  // Computed progress (0 to 1) - reactive unlike function
  const progress = computed(() => Math.min(pullDistance.value / threshold, 1))

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    progress,
  }
}
