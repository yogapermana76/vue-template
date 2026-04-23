/**
 * Dominant Color Extraction Composable
 * Extracts the dominant color from an image using colorthief
 */

import { ref, watch, computed, type Ref, type MaybeRef, toValue } from 'vue'
import { getColor } from 'colorthief'

export interface UseDominantColorOptions {
  /** Fallback color when extraction fails (default: null) */
  fallback?: string | null
  /** Quality of color extraction, 1 is highest, 10 is default */
  quality?: number
}

export interface UseDominantColorReturn {
  /** The extracted dominant color as hex string (e.g., '#e84393') */
  color: Ref<string | null>
  /** Whether color extraction is in progress */
  isLoading: Ref<boolean>
  /** Whether color extraction failed */
  isError: Ref<boolean>
  /** Error message if extraction failed */
  error: Ref<string | null>
  /** Handler to attach to image @load event */
  onImageLoad: (event: Event) => void
  /** Manually extract color from an image element */
  extractColor: (img: HTMLImageElement) => Promise<void>
  /** Reset state (useful when image URL changes) */
  reset: () => void
  /** Computed style object for backgroundColor */
  backgroundStyle: Ref<{ backgroundColor: string } | undefined>
  /** Computed style object for gradient overlay (transparent to color) */
  gradientStyle: Ref<{ background: string } | undefined>
}

/**
 * Composable for extracting dominant color from images
 *
 * @example
 * ```vue
 * <script setup>
 * const { color, onImageLoad, backgroundStyle } = useDominantColor()
 * </script>
 *
 * <template>
 *   <div :style="backgroundStyle">
 *     <img :src="imageUrl" crossorigin="anonymous" @load="onImageLoad" />
 *   </div>
 * </template>
 * ```
 */
export function useDominantColor(
  imageUrl?: MaybeRef<string | undefined>,
  options: UseDominantColorOptions = {},
): UseDominantColorReturn {
  const { fallback = null, quality = 10 } = options

  const color = ref<string | null>(null)
  const isLoading = ref(false)
  const isError = ref(false)
  const error = ref<string | null>(null)

  const reset = () => {
    color.value = null
    isLoading.value = false
    isError.value = false
    error.value = null
  }

  const extractColor = async (img: HTMLImageElement): Promise<void> => {
    if (!img.complete || img.naturalWidth === 0) {
      return
    }

    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const extractedColor = await getColor(img, { quality })
      if (extractedColor) {
        color.value = extractedColor.hex()
      } else {
        color.value = fallback
      }
    } catch (err) {
      isError.value = true
      error.value = err instanceof Error ? err.message : 'Failed to extract color'
      color.value = fallback

      // Log in development for debugging CORS issues
      if (import.meta.env.DEV) {
        console.warn('[useDominantColor] Failed to extract color:', error.value)
      }
    } finally {
      isLoading.value = false
    }
  }

  const onImageLoad = (event: Event) => {
    const img = event.target as HTMLImageElement
    extractColor(img)
  }

  // Watch for URL changes and reset state
  if (imageUrl !== undefined) {
    watch(
      () => toValue(imageUrl),
      () => {
        reset()
      },
    )
  }

  const backgroundStyle = computed(() => {
    return color.value ? { backgroundColor: color.value } : undefined
  })

  const gradientStyle = computed(() => {
    if (!color.value) return undefined
    return {
      background: `linear-gradient(to bottom, transparent 0%, ${color.value} 100%)`,
    }
  })

  return {
    color,
    isLoading,
    isError,
    error,
    onImageLoad,
    extractColor,
    reset,
    backgroundStyle,
    gradientStyle,
  }
}
