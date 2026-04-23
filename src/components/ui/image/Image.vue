<script setup lang="ts">
  /**
   * Image Component
   *
   * A reusable image component with loading states and error fallback.
   * Inspired by Next.js Image component.
   */

  import { computed, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { useImage, type ImageLoadingStrategy } from '@/composables/ui/useImage'
  import { Skeleton } from '@/components/ui/skeleton'

  export interface ImageProps {
    /** Image source URL */
    src: string
    /** Alt text for accessibility */
    alt?: string
    /** Loading strategy: 'skeleton', 'blur', or 'none' */
    loadingStrategy?: ImageLoadingStrategy
    /** Fallback image URL when loading fails */
    fallbackSrc?: string
    /** Aspect ratio (e.g., '16/9', '4/3', 'square') */
    aspectRatio?: string
    /** Object fit mode */
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    /** Object position */
    objectPosition?: string
    /** Enable lazy loading */
    lazy?: boolean
    /** Blur amount in pixels for blur strategy */
    blurAmount?: number
    /** Custom class for the container */
    containerClass?: HTMLAttributes['class']
    /** Custom class for the image */
    class?: HTMLAttributes['class']
    /** CORS setting for the image */
    crossorigin?: 'anonymous' | 'use-credentials'
  }

  const props = withDefaults(defineProps<ImageProps>(), {
    alt: '',
    loadingStrategy: 'skeleton',
    objectFit: 'cover',
    objectPosition: 'center',
    lazy: true,
    blurAmount: 20,
  })

  const emit = defineEmits<{
    load: [event: Event]
    error: [event: Event]
  }>()

  const { isLoading, isError, isFallback, onLoad, onError, blurStyle } = useImage(() => props.src, {
    fallbackSrc: props.fallbackSrc,
    blurAmount: props.blurAmount,
  })

  const handleLoad = (event: Event) => {
    onLoad()
    emit('load', event)
  }

  const handleError = (event: Event) => {
    onError()
    emit('error', event)
  }

  const currentSrc = computed(() => {
    if (isError.value && props.fallbackSrc) {
      return props.fallbackSrc
    }
    return props.src
  })

  const aspectRatioClass = computed(() => {
    if (!props.aspectRatio) return ''

    const presets: Record<string, string> = {
      square: 'aspect-square',
      video: 'aspect-video',
      '16/9': 'aspect-[16/9]',
      '4/3': 'aspect-[4/3]',
      '3/2': 'aspect-[3/2]',
      '2/1': 'aspect-[2/1]',
      '1/1': 'aspect-square',
    }

    return presets[props.aspectRatio] || `aspect-[${props.aspectRatio}]`
  })

  const objectFitClass = computed(() => {
    const fitClasses: Record<string, string> = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    }
    return fitClasses[props.objectFit]
  })

  const containerClasses = computed(() => {
    return cn(
      'relative overflow-hidden bg-neutral-100',
      aspectRatioClass.value,
      props.containerClass,
    )
  })

  const imageClasses = computed(() => {
    return cn(
      'h-full w-full transition-[filter,opacity] duration-300',
      objectFitClass.value,
      props.loadingStrategy === 'skeleton' && isLoading.value && 'opacity-0',
      props.class,
    )
  })

  const imageStyle = computed(() => {
    const style: Record<string, string> = {}

    if (props.objectPosition !== 'center') {
      style.objectPosition = props.objectPosition
    }

    if (props.loadingStrategy === 'blur' && blurStyle.value) {
      Object.assign(style, blurStyle.value)
    }

    return Object.keys(style).length > 0 ? style : undefined
  })
</script>

<template>
  <div data-slot="image" :class="containerClasses">
    <!-- Skeleton Loading -->
    <Skeleton
      v-if="loadingStrategy === 'skeleton' && isLoading"
      class="absolute inset-0 h-full w-full rounded-[inherit]"
    />

    <!-- Main Image -->
    <img
      :src="currentSrc"
      :alt="alt"
      :class="imageClasses"
      :style="imageStyle"
      :loading="lazy ? 'lazy' : 'eager'"
      :crossorigin="crossorigin"
      decoding="async"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Error State -->
    <div
      v-if="isError && !isFallback"
      class="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-neutral-100"
    >
      <svg
        class="size-8 text-neutral-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    </div>

    <!-- Overlay Slot -->
    <slot />
  </div>
</template>
