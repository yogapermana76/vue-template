import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface UsePullToRefreshOptions {
  /**
   * The element to attach the pull-to-refresh behavior
   * If not provided, uses document.body
   */
  containerRef?: Ref<HTMLElement | null>
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
   * Callback function when refresh is triggered
   */
  onRefresh: () => Promise<void>
  /**
   * Whether pull-to-refresh is enabled
   * @default true
   */
  enabled?: boolean
}

export function usePullToRefresh(options: UsePullToRefreshOptions) {
  const { threshold = 80, maxPull = 120, onRefresh, enabled = true } = options

  const isRefreshing = ref(false)
  const pullDistance = ref(0)
  const isPulling = ref(false)

  let startY = 0
  let currentY = 0

  /**
   * Check if touch event originates from inside an overlay (modal, drawer, dialog, etc.)
   * Uses a generic approach that works with any overlay library
   */
  const isInsideOverlay = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false

    // Generic selectors for common overlay patterns
    const overlaySelectors = [
      '[role="dialog"]',
      '[role="alertdialog"]',
      '[data-state="open"][data-vaul-drawer]',
      '[data-radix-dialog-content]',
      '[data-radix-alert-dialog-content]',
      '.modal',
      '.drawer',
      '.bottom-sheet',
    ]

    return overlaySelectors.some(selector => target.closest(selector))
  }

  const canPull = (): boolean => {
    if (!enabled) return false
    if (isRefreshing.value) return false

    // Check if we're at the top of the page
    const container = options.containerRef?.value || document.documentElement
    return container.scrollTop <= 0
  }

  const handleTouchStart = (e: TouchEvent) => {
    // Check overlay at touch start to avoid interference
    if (isInsideOverlay(e.target)) return
    if (!canPull()) return

    startY = e.touches[0].clientY
    isPulling.value = true
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.value || !canPull()) return

    currentY = e.touches[0].clientY
    const diff = currentY - startY

    if (diff > 0) {
      // Apply resistance to make pull feel natural
      const resistance = 0.5
      pullDistance.value = Math.min(diff * resistance, maxPull)

      // Prevent default scroll when pulling
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
      pullDistance.value = threshold * 0.6 // Show loading indicator

      try {
        await onRefresh()
      } finally {
        isRefreshing.value = false
        pullDistance.value = 0
      }
    } else {
      pullDistance.value = 0
    }

    startY = 0
    currentY = 0
  }

  const setupListeners = () => {
    const container = options.containerRef?.value || document

    container.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true })
    container.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false })
    container.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true })
  }

  const removeListeners = () => {
    const container = options.containerRef?.value || document

    container.removeEventListener('touchstart', handleTouchStart as EventListener)
    container.removeEventListener('touchmove', handleTouchMove as EventListener)
    container.removeEventListener('touchend', handleTouchEnd as EventListener)
  }

  onMounted(() => {
    setupListeners()
  })

  onUnmounted(() => {
    removeListeners()
  })

  // Calculate progress (0 to 1)
  const progress = () => Math.min(pullDistance.value / threshold, 1)

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    progress,
  }
}
