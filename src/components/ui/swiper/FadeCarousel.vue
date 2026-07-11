<script setup lang="ts" generic="T">
  import { computed, shallowRef } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { EffectFade } from 'swiper/modules'
  import type { Swiper as SwiperInstance } from 'swiper'
  import { useSwiperStyles } from '@/composables/ui/useSwiperStyles'
  import { useCarouselAutoplay } from './useCarouselAutoplay'

  useSwiperStyles()

  const props = withDefaults(
    defineProps<{
      /** Slide data — one entry per rendered slide. */
      slides: T[]
      /** Autoplay delay in ms. Set to 0 to disable. */
      autoplayDelay?: number
      /** Pause autoplay (e.g. while loading). */
      paused?: boolean
      /** Fade transition speed in ms. */
      speed?: number
      /** Disable touch-swipe (e.g. static promotional carousels). */
      allowTouchMove?: boolean
    }>(),
    {
      autoplayDelay: 4000,
      paused: false,
      speed: 700,
      allowTouchMove: true,
    },
  )

  const emit = defineEmits<{
    'update:activeIndex': [value: number]
  }>()

  defineSlots<{
    /** Rendered once per slide. Receives the slide item + index. */
    slide(props: { item: T; index: number }): unknown
    /** Rendered on top of every slide (positioned via absolute inset-0). */
    overlay(props: { activeIndex: number; total: number; goTo: (i: number) => void }): unknown
    /** Rendered when `slides` is empty (no slides to show). */
    empty(): unknown
  }>()

  const swiperRef = shallowRef<SwiperInstance | null>(null)

  const advance = (index: number) => {
    swiperRef.value?.slideTo(index)
  }

  const { activeIndex, start } = useCarouselAutoplay({
    total: () => props.slides.length,
    delayMs: props.autoplayDelay,
    paused: () => props.paused || props.autoplayDelay <= 0,
    onAdvance: advance,
  })

  const onSwiper = (instance: SwiperInstance) => {
    swiperRef.value = instance
    start()
  }

  const onSlideChange = (instance: SwiperInstance) => {
    activeIndex.value = instance.activeIndex
    emit('update:activeIndex', instance.activeIndex)
  }

  const goTo = (index: number) => {
    advance(index)
    start()
  }

  const showEmpty = computed(() => props.slides.length === 0)
</script>

<template>
  <div class="relative h-full w-full">
    <slot v-if="showEmpty" name="empty" />

    <Swiper
      v-else
      :modules="[EffectFade]"
      :slides-per-view="1"
      :space-between="0"
      :allow-touch-move="allowTouchMove"
      effect="fade"
      :fade-effect="{ crossFade: true }"
      :speed="speed"
      class="h-full w-full"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(item, i) in slides" :key="i">
        <slot name="slide" :item="item" :index="i" />
      </SwiperSlide>
    </Swiper>

    <slot
      v-if="!showEmpty"
      name="overlay"
      :active-index="activeIndex"
      :total="slides.length"
      :go-to="goTo"
    />
  </div>
</template>
