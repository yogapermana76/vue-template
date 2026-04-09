<script setup lang="ts">
  import { computed, type Component, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
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
  }>()

  const pointsDisplay = computed(() => {
    if (!props.points) return ''
    return `${props.points.toLocaleString('id-ID')} poin`
  })

  const handleButtonClick = () => {
    emit('buttonClick')
  }
</script>

<template>
  <div
    data-slot="reward-banner-card"
    :class="
      cn(
        'bg-primary-500 relative h-66 w-full overflow-visible rounded-lg border border-slate-200',
        props.class,
      )
    "
  >
    <!-- Banner Image -->
    <img :src="imageUrl" :alt="imageAlt" class="h-32 w-full rounded-t-lg object-cover" />

    <!-- Overlay Card (positioned at bottom) -->
    <div
      class="absolute bottom-3 left-1/2 flex w-[calc(100%-16px)] -translate-x-1/2 flex-col items-center gap-0.5 rounded-lg bg-white py-3"
    >
      <!-- Content -->
      <div class="flex w-full flex-col gap-1 px-4">
        <!-- Title -->
        <h3 class="body-m-semibold text-slate-950">{{ title }}</h3>

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

          <!-- Points Display (Optional) -->
          <div v-if="points" class="flex items-center gap-1">
            <CoinIcon class="size-4 shrink-0" aria-hidden="true" />
            <span class="body-caption-medium text-slate-800/75">{{ pointsDisplay }}</span>
          </div>
        </div>
      </div>

      <!-- Divider with primary colored circles -->
      <div class="relative h-5 w-full">
        <!-- Left Circle with primary color -->
        <div
          class="bg-primary-500 absolute top-1/2 -left-2 size-4 -translate-y-1/2 rounded-full"
          aria-hidden="true"
        />

        <!-- Divider Line -->
        <div class="flex h-full items-center">
          <Divider variant="dashed" orientation="horizontal" class="w-full" />
        </div>

        <!-- Right Circle with primary color -->
        <div
          class="bg-primary-500 absolute top-1/2 -right-2 size-4 -translate-y-1/2 rounded-full"
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
