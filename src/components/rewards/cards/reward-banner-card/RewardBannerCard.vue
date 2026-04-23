<script setup lang="ts">
  import { computed, toRef, type Component, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { formatNumber } from '@/utils/currency'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { useDominantColor } from '@/composables/ui'
  import { Image } from '@/components/ui'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  export interface RewardBannerCardProps {
    /** Banner image URL (image should include background color) */
    imageUrl: string
    /** Banner image alt text */
    imageAlt?: string
    /** Card title */
    title: string
    /** Duration/period text (e.g., "Agustus - Oktober 2025") */
    durationText?: string
    /** Duration icon (from lucide-vue-next) */
    durationIcon?: Component | null
    /** Status text (e.g., "Kamu Menang Undian!") */
    statusText?: string
    /** Status icon (from lucide-vue-next) */
    statusIcon?: Component | null
    /** Points earned (optional) */
    points?: number
    /** Button label */
    buttonLabel?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardBannerCardProps>(), {
    imageAlt: 'Reward banner image',
    buttonLabel: 'Ambil Hadiah',
  })

  const emit = defineEmits<{
    /** Emitted when the action button is clicked */
    buttonClick: []
    /** Emitted when the card is clicked */
    cardClick: []
  }>()

  const {
    color: dominantColor,
    onImageLoad,
    backgroundStyle,
    gradientStyle,
  } = useDominantColor(toRef(() => props.imageUrl))

  const pointsDisplay = computed(() => {
    if (props.points === undefined) return ''
    return `${formatNumber(props.points)} poin`
  })

  const handleButtonClick = (event: Event) => {
    event.stopPropagation()
    emit('buttonClick')
  }

  const handleCardClick = () => {
    emit('cardClick')
  }
</script>

<template>
  <div
    data-slot="reward-banner-card"
    :class="
      cn(
        'relative w-full cursor-pointer overflow-hidden rounded-sm border border-slate-200',
        !dominantColor && 'bg-primary-500',
        props.class,
      )
    "
    :style="backgroundStyle"
    @click="handleCardClick"
  >
    <!-- Banner Image Container (fixed height) -->
    <div class="relative h-28 w-full overflow-hidden rounded-t-sm">
      <!-- Image -->
      <Image
        :src="imageUrl"
        :alt="imageAlt"
        crossorigin="anonymous"
        loading-strategy="none"
        container-class="h-42.75 w-full"
        @load="onImageLoad"
      />
      <!-- Gradient Overlay (bottom fade to dominant color, fallback to primary-500) -->
      <div
        :class="
          cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-14.75',
            !dominantColor && 'via-primary-500/50 to-primary-500 bg-linear-to-b from-transparent',
          )
        "
        :style="gradientStyle"
        aria-hidden="true"
      />
    </div>

    <!-- Overlay Card (uses negative margin to overlap image) -->
    <div
      class="relative z-10 mx-2 mb-2 flex flex-col items-center gap-0.5 rounded-sm bg-white py-3"
    >
      <!-- Content -->
      <div class="flex w-full flex-col gap-1 px-4">
        <!-- Title -->
        <h3 class="body-m-semibold line-clamp-1 text-slate-950">{{ title }}</h3>

        <!-- Duration & Status Container -->
        <div class="flex flex-col gap-1">
          <!-- Duration (Optional) -->
          <div v-if="durationText" class="flex items-center gap-1">
            <component
              v-if="durationIcon"
              :is="durationIcon"
              class="size-4 shrink-0 text-slate-500"
            />
            <span class="body-caption-medium text-slate-800/75">{{ durationText }}</span>
          </div>

          <!-- Status Text (Optional) -->
          <div v-if="statusText" class="flex items-center gap-1">
            <component
              v-if="statusIcon"
              :is="statusIcon"
              class="text-primary-600 size-4 shrink-0"
            />
            <span class="body-caption-medium text-primary-700">{{ statusText }}</span>
          </div>

          <!-- Points Display (Optional, shown when points prop is provided including 0) -->
          <div v-if="points !== undefined" class="flex items-center gap-1">
            <CoinIcon class="size-4 shrink-0" aria-hidden="true" />
            <span class="body-caption-medium text-slate-800/75">{{ pointsDisplay }}</span>
          </div>
        </div>
      </div>

      <!-- Divider with primary colored circles -->
      <div class="relative h-5 w-full">
        <!-- Left Circle with dynamic color -->
        <div
          :class="
            cn(
              'absolute top-1/2 -left-2 size-4 -translate-y-1/2 rounded-full',
              !dominantColor && 'bg-primary-500',
            )
          "
          :style="backgroundStyle"
          aria-hidden="true"
        />

        <!-- Divider Line -->
        <div class="flex h-full items-center">
          <Divider variant="dashed" orientation="horizontal" class="w-full" />
        </div>

        <!-- Right Circle with dynamic color -->
        <div
          :class="
            cn(
              'absolute top-1/2 -right-2 size-4 -translate-y-1/2 rounded-full',
              !dominantColor && 'bg-primary-500',
            )
          "
          :style="backgroundStyle"
          aria-hidden="true"
        />
      </div>

      <!-- Action Button -->
      <div class="w-full px-6">
        <Button variant="primary" size="xs" class="h-8 w-full" @click="handleButtonClick">
          {{ buttonLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>
