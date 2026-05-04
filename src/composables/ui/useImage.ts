/**
 * Image Loading Composable
 * Handles image loading states and error fallback
 */

import { ref, watch, computed, type Ref, type MaybeRefOrGetter, toValue } from 'vue'

export type ImageLoadingStrategy = 'skeleton' | 'blur' | 'none'

export interface UseImageOptions {
  /** Fallback image URL when loading fails */
  fallbackSrc?: string
  /** Blur amount for blur loading strategy (in pixels) */
  blurAmount?: number
}

export interface UseImageReturn {
  /** Whether the image is currently loading */
  isLoading: Ref<boolean>
  /** Whether the image failed to load */
  isError: Ref<boolean>
  /** Whether currently showing fallback image */
  isFallback: Ref<boolean>
  /** Handler to attach to img @load event */
  onLoad: () => void
  /** Handler to attach to img @error event */
  onError: () => void
  /** Computed blur filter style */
  blurStyle: Ref<{ filter: string; transition: string } | undefined>
}

export function useImage(
  src: MaybeRefOrGetter<string | undefined>,
  options: UseImageOptions = {},
): UseImageReturn {
  const { fallbackSrc, blurAmount = 20 } = options

  const isLoading = ref(true)
  const isError = ref(false)
  const isFallback = ref(false)

  const reset = () => {
    isLoading.value = true
    isError.value = false
    isFallback.value = false
  }

  const onLoad = () => {
    isLoading.value = false
    isError.value = false
  }

  const onError = () => {
    isLoading.value = false
    isError.value = true

    if (fallbackSrc) {
      isFallback.value = true
    }
  }

  const blurStyle = computed(() => {
    const blur = isLoading.value ? blurAmount : 0
    return {
      filter: `blur(${blur}px)`,
      transition: 'filter 0.3s ease-out',
    }
  })

  watch(
    () => toValue(src),
    (newSrc, oldSrc) => {
      if (newSrc !== oldSrc) {
        reset()
      }
    },
  )

  return {
    isLoading,
    isError,
    isFallback,
    onLoad,
    onError,
    blurStyle,
  }
}
