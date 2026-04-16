<script setup lang="ts">
  import { computed, type Component, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Button } from '@/components/ui/button'
  import { StockBadge } from '@/components/ui/badge'
  import CoinIcon from '@/assets/icons/coin.svg?component'

  type FlagIcon = 'check' | 'discount' | 'ticket' | 'thumbs-up'
  type FlagVariant = 'primary' | 'success' | 'danger' | 'info'

  export interface RewardCouponCardCompactProps {
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
    /** Ellipse cutout color (hex or tailwind class) */
    ellipseColor?: string
    /** Whether the voucher is sold out / disabled */
    disabled?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardCouponCardCompactProps>(), {
    imageAlt: 'Reward card image',
    buttonLabel: 'Tukar',
    flagVariant: 'success',
    flagIcon: 'ticket',
    ellipseColor: '#ffffff',
    disabled: false,
  })

  const emit = defineEmits<{
    /** Emitted when the action button is clicked */
    buttonClick: []
    /** Emitted when the card is clicked */
    cardClick: []
  }>()

  // Compute display text for points
  const pointsDisplay = computed(() => {
    return `${props.points.toLocaleString('id-ID')} poin`
  })

  const handleButtonClick = (event: Event) => {
    event.stopPropagation()
    emit('buttonClick')
  }

  const handleCardClick = () => {
    if (!props.disabled) {
      emit('cardClick')
    }
  }
</script>

<template>
  <div
    data-slot="reward-coupon-card-compact"
    :class="
      cn(
        'relative flex h-auto w-full flex-col rounded-sm border border-slate-200 bg-white',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        props.class,
      )
    "
    @click="handleCardClick"
  >
    <!-- Image Container -->
    <div class="relative aspect-2/1 w-full overflow-hidden rounded-t-sm border-b border-slate-200">
      <img
        :src="imageUrl"
        :alt="imageAlt"
        :class="cn('h-full w-full object-cover', disabled && 'grayscale')"
      />

      <!-- Stock Badge (Bottom-right of image) -->
      <div v-if="flagText" class="absolute right-0 bottom-0 z-10">
        <StockBadge :variant="disabled ? 'danger' : 'success'" :icon="disabled ? 'none' : 'ticket'">
          {{ flagText }}
        </StockBadge>
      </div>
    </div>

    <!-- Content Container -->
    <div class="relative flex flex-col items-start gap-4 p-2">
      <!-- Title and Points -->
      <div class="flex flex-col items-start gap-1 self-stretch">
        <!-- Title -->
        <h3 class="body-caption-semibold line-clamp-1 self-stretch text-slate-950">{{ title }}</h3>

        <!-- Status Text (Optional) -->
        <div v-if="statusText" class="flex items-center gap-1 self-stretch">
          <component v-if="statusIcon" :is="statusIcon" class="size-3 shrink-0 text-slate-500" />
          <p class="body-small text-slate-500">{{ statusText }}</p>
        </div>

        <!-- Points Display -->
        <div class="flex items-center gap-1 self-stretch">
          <CoinIcon />
          <span class="body-small text-slate-800/75">{{ pointsDisplay }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <Button
        variant="secondary"
        size="xs"
        :disabled="disabled"
        class="w-full self-stretch"
        @click="handleButtonClick"
      >
        {{ buttonLabel }}
      </Button>
    </div>
  </div>
</template>
