<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { Button } from '@/components/ui/button'
  import { Flag } from '@/components/ui/flag'
  import { Clock, Info } from 'lucide-vue-next'
  import CouponIcon from '@/assets/icons/coupon-24.svg?component'
  import CircleDefaultSvg from '@/assets/vectors/circle-default.svg?component'
  import CircleActiveSvg from '@/assets/vectors/circle-active.svg?component'

  export type VoucherCardState = 'default' | 'selected' | 'disabled'

  export interface VoucherCardProps {
    /** Card title */
    title: string
    /** Expiry date text (e.g., "Hingga 31/12/2025") */
    expiryText?: string
    /** Info text (e.g., "min pembelian token 5rb") */
    infoText?: string
    /** Button label */
    buttonLabel?: string
    /** Card state: default, selected, or disabled */
    state?: VoucherCardState
    /** Show flag badge */
    showFlag?: boolean
    /** Flag text (e.g., "Tersisa 5 Voucher") */
    flagText?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<VoucherCardProps>(), {
    expiryText: '',
    infoText: '',
    buttonLabel: 'Lihat Detail',
    state: 'default',
    showFlag: false,
    flagText: 'Tersisa 5 Voucher',
  })

  const emit = defineEmits<{
    /** Emitted when button is clicked */
    buttonClick: []
    /** Emitted when card is clicked */
    cardClick: []
  }>()

  const isDisabled = computed(() => props.state === 'disabled')
  const isSelected = computed(() => props.state === 'selected')

  // Card border color based on state
  const cardBorderClass = computed(() => {
    if (isSelected.value) return 'border-2 border-primary-600'
    return 'border border-slate-200'
  })

  // Text color based on state
  const textColorClass = computed(() => {
    if (isDisabled.value) return 'text-slate-500'
    return 'text-slate-950'
  })

  const subtextColorClass = computed(() => {
    if (isDisabled.value) return 'text-slate-500'
    return 'text-slate-800'
  })

  const infoColorClass = computed(() => {
    if (isDisabled.value) return 'text-slate-500'
    return 'text-secondary-700'
  })

  // Circle SVG component based on state
  const CircleComponent = computed(() => {
    if (isSelected.value) return CircleActiveSvg
    return CircleDefaultSvg
  })

  const handleButtonClick = (event: Event) => {
    event.stopPropagation()
    if (!isDisabled.value) {
      emit('buttonClick')
    }
  }

  const handleCardClick = () => {
    if (!isDisabled.value) {
      emit('cardClick')
    }
  }
</script>

<template>
  <div
    data-slot="voucher-card"
    :class="
      cn(
        'relative flex w-full flex-col gap-1 rounded-sm bg-white py-4 transition-transform',
        cardBorderClass,
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]',
        props.class,
      )
    "
    @click="handleCardClick"
  >
    <!-- Flag Badge (Top-right corner) -->
    <div
      v-if="showFlag"
      :class="cn('absolute -top-3 z-10', isSelected ? '-right-3.5' : '-right-3')"
    >
      <Flag :variant="isDisabled ? 'neutral' : 'success'" size="sm" icon="ticket" pointer>
        {{ flagText }}
      </Flag>
    </div>

    <!-- Top Section: Icon + Title + Duration -->
    <div class="flex items-start gap-2 px-4">
      <!-- Coupon Icon -->
      <div :class="cn('size-6 shrink-0', isDisabled && 'grayscale')">
        <CouponIcon />
      </div>

      <!-- Text Group -->
      <div class="flex flex-1 flex-col gap-1">
        <!-- Title -->
        <h3 :class="cn('body-m-semibold', textColorClass)">{{ title }}</h3>

        <!-- Duration -->
        <div v-if="expiryText" class="flex items-center gap-1">
          <Clock :class="cn('size-4 shrink-0', subtextColorClass)" />
          <span :class="cn('body-caption', subtextColorClass)">{{ expiryText }}</span>
        </div>
      </div>
    </div>

    <!-- Divider with Circle Cutouts -->
    <div class="relative h-5">
      <!-- Left Circle (half circle cutout) -->
      <div
        :class="['absolute top-1/2 -translate-y-1/2', isSelected ? '-left-0.5' : '-left-px']"
        aria-hidden="true"
      >
        <component :is="CircleComponent" />
      </div>

      <!-- Divider Line -->
      <div class="flex h-full items-center">
        <div class="h-px w-full border-t border-dashed border-slate-200" />
      </div>

      <!-- Right Circle (half circle cutout, flipped) -->
      <div
        :class="[
          'absolute top-1/2 -translate-y-1/2 -scale-x-100',
          isSelected ? '-right-0.5' : '-right-px',
        ]"
        aria-hidden="true"
      >
        <component :is="CircleComponent" />
      </div>
    </div>

    <!-- Bottom Section: Info + Button -->
    <div class="flex items-center justify-between gap-10 px-4">
      <!-- Info Text -->
      <div v-if="infoText" class="flex items-center gap-1.5">
        <Info :class="cn('size-4 shrink-0', infoColorClass)" />
        <span :class="cn('body-caption', infoColorClass)">{{ infoText }}</span>
      </div>

      <!-- Action Button -->
      <Button
        variant="secondary"
        size="xs"
        :disabled="isDisabled"
        class="ml-auto shrink-0"
        @click="handleButtonClick"
      >
        {{ buttonLabel }}
      </Button>
    </div>
  </div>
</template>
