<script setup lang="ts">
  import { computed, type Component, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Button } from '@/components/ui/button'
  import { Flag, type FlagVariant } from '@/components/ui/flag'
  import { Divider } from '@/components/ui/divider'
  import CoinIcon from '@/assets/icons/coin.svg?component'
  import EllipseSvg from '@/assets/icons/ellipse.svg?component'

  type FlagIcon = 'check' | 'discount' | 'ticket' | 'thumbs-up'

  export interface RewardCouponCardProps {
    /** Card image URL */
    imageUrl: string
    /** Card image alt text */
    imageAlt?: string
    /** Card title */
    title: string
    /** Points required to redeem */
    points: number
    /** Button label (e.g., "Tukar Voucher") */
    buttonLabel?: string
    /** Optional flag content (e.g., "Tersisa 5 Voucher") */
    flagText?: string
    /** Flag variant */
    flagVariant?: FlagVariant
    /** Flag icon type */
    flagIcon?: FlagIcon
    /** Status text (e.g., "Sudah digunakan", "Hingga 31/12/2025") */
    statusText?: string
    /** Status icon (from lucide-vue-next) */
    statusIcon?: Component | null
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardCouponCardProps>(), {
    imageAlt: 'Reward card image',
    buttonLabel: 'Tukar',
    flagVariant: 'success',
    flagIcon: 'ticket',
  })

  const emit = defineEmits<{
    /** Emitted when the action button is clicked */
    buttonClick: []
  }>()

  // Compute display text for points
  const pointsDisplay = computed(() => {
    return `${props.points.toLocaleString('id-ID')} poin`
  })

  const handleButtonClick = () => {
    emit('buttonClick')
  }
</script>

<template>
  <div
    data-slot="reward-coupon-card"
    :class="
      cn(
        'relative flex h-auto w-full flex-col rounded-lg border border-slate-200 bg-white',
        props.class,
      )
    "
  >
    <!-- Flag Badge (Top-right corner) -->
    <div v-if="flagText" class="absolute -top-3 -right-3 z-10">
      <Flag :variant="flagVariant" :icon="flagIcon" pointer size="sm">
        {{ flagText }}
      </Flag>
    </div>

    <!-- Image Container -->
    <div class="h-42.75 w-full overflow-hidden rounded-t-lg">
      <img :src="imageUrl" :alt="imageAlt" class="h-full w-full object-cover" />
    </div>

    <!-- Content Container -->
    <div class="relative flex flex-col gap-1 py-3">
      <!-- Title -->
      <div class="px-4">
        <h3 class="body-m-semibold text-slate-950">{{ title }}</h3>
      </div>

      <!-- Status Text (Optional) -->
      <div v-if="statusText" class="flex items-center gap-2 px-4">
        <component v-if="statusIcon" :is="statusIcon" class="size-4 shrink-0 text-slate-500" />
        <p class="body-caption text-slate-500">{{ statusText }}</p>
      </div>

      <!-- Divider with Circle Cutouts -->
      <div class="relative h-5">
        <!-- Left Circle -->
        <div class="absolute top-1/2 -left-px -translate-y-1/2" aria-hidden="true">
          <EllipseSvg />
        </div>

        <!-- Divider Line -->
        <div class="flex h-full items-center">
          <Divider variant="dashed" orientation="horizontal" class="w-full" />
        </div>

        <!-- Right Circle -->
        <div class="absolute top-1/2 -right-px -translate-y-1/2 -scale-x-100" aria-hidden="true">
          <EllipseSvg />
        </div>
      </div>

      <!-- Points and Button -->
      <div class="flex items-center justify-between gap-2 px-4">
        <!-- Points Display -->
        <div class="flex flex-1 items-center gap-1">
          <CoinIcon class="size-4 shrink-0" aria-hidden="true" />
          <span class="body-caption-medium text-slate-800/75">{{ pointsDisplay }}</span>
        </div>

        <!-- Action Button -->
        <Button variant="secondary" size="xs" @click="handleButtonClick">
          {{ buttonLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>
