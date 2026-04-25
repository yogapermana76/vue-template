<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { Image } from '@/components/ui/image'
  import { Badge, type BadgeVariants } from '@/components/ui/badge'
  import { Divider } from '@/components/ui/divider'
  import { Button } from '@/components/ui/button'
  import { useCountdown } from '@/composables/ui/useCountdown'

  export type PurchaseHistoryStatus =
    | 'pending-payment'
    | 'active'
    | 'used'
    | 'expired'
    | 'cancelled'

  export interface PurchaseHistoryTicketInfo {
    /** Number of adults */
    adults?: number
    /** Number of children */
    children?: number
  }

  export interface PurchaseHistoryCardProps {
    /** Event date (e.g., "4 Januari 2026") */
    date: string
    /** Event title */
    title: string
    /** Event subtitle/package name */
    subtitle?: string
    /** Ticket info (adults, children) */
    ticketInfo?: PurchaseHistoryTicketInfo
    /** Event image URL */
    imageUrl: string
    /** Purchase status */
    status: PurchaseHistoryStatus
    /** Payment deadline as ISO string or Unix timestamp (ms) for countdown */
    paymentDeadline?: string | number
    /** Action button text */
    actionText?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<PurchaseHistoryCardProps>(), {
    actionText: 'Lihat Tiket',
  })

  const emit = defineEmits<{
    /** Emitted when the action button is clicked */
    action: []
    /** Emitted when the card is clicked */
    click: []
    /** Emitted when countdown expires */
    expired: []
  }>()

  // Static config - defined outside computed to avoid re-creation
  const STATUS_CONFIG: Record<
    PurchaseHistoryStatus,
    { label: string; variant: BadgeVariants['variant'] }
  > = {
    'pending-payment': { label: 'Menunggu Pembayaran', variant: 'warning' },
    active: { label: 'Aktif', variant: 'success' },
    used: { label: 'Sudah digunakan', variant: 'info' },
    expired: { label: 'Kadaluarsa', variant: 'neutral' },
    cancelled: { label: 'Dibatalkan', variant: 'error' },
  } as const

  const statusConfig = computed(() => STATUS_CONFIG[props.status])

  const ticketInfoText = computed(() => {
    const { ticketInfo } = props
    if (!ticketInfo) return null

    const parts: string[] = []
    if (ticketInfo.adults && ticketInfo.adults > 0) {
      parts.push(`${ticketInfo.adults} Dewasa`)
    }
    if (ticketInfo.children && ticketInfo.children > 0) {
      parts.push(`${ticketInfo.children} Anak`)
    }

    return parts.length > 0 ? parts : null
  })

  const isPendingPayment = computed(() => props.status === 'pending-payment')

  const buttonVariant = computed(() => (isPendingPayment.value ? 'primary' : 'secondary'))

  // Countdown - only active when pending payment
  const countdownDeadline = computed(() => (isPendingPayment.value ? props.paymentDeadline : null))

  const { display: countdownDisplay } = useCountdown(countdownDeadline, {
    onExpire: () => emit('expired'),
  })

  const handleAction = () => {
    emit('action')
  }

  const handleCardClick = () => {
    emit('click')
  }
</script>

<template>
  <div
    data-slot="purchase-history-card"
    :class="cn('flex w-full flex-col gap-2', props.class)"
    @click="handleCardClick"
  >
    <!-- Header: Date & Status -->
    <div class="flex items-center justify-between">
      <span class="body-m text-slate-950">{{ date }}</span>
      <Badge :variant="statusConfig.variant">
        {{ statusConfig.label }}
      </Badge>
    </div>

    <!-- Content: Image & Info -->
    <div class="flex items-start gap-4">
      <!-- Event Image -->
      <Image
        :src="imageUrl"
        :alt="title"
        aspect-ratio="square"
        class="size-20 shrink-0 rounded-xl border border-neutral-100"
      />

      <!-- Event Info -->
      <div class="flex min-h-20 flex-1 flex-col justify-between gap-2">
        <!-- Title -->
        <h3 class="body-m line-clamp-2 text-slate-950">
          {{ title }}
        </h3>

        <!-- Subtitle -->
        <p v-if="subtitle" class="body-caption line-clamp-1 text-slate-800">
          {{ subtitle }}
        </p>

        <!-- Ticket Info -->
        <div v-if="ticketInfoText" class="flex items-center gap-1">
          <template v-for="(info, index) in ticketInfoText" :key="index">
            <span class="body-caption-medium text-primary-700">{{ info }}</span>
            <span v-if="index < ticketInfoText.length - 1" class="body-caption text-slate-400">
              &bull;
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <Divider />

    <!-- Footer: Payment Info & Action -->
    <div class="flex items-center justify-end gap-2.5">
      <!-- Payment Deadline (for pending payment) -->
      <div v-if="isPendingPayment && countdownDisplay" class="flex flex-1 flex-col">
        <span class="body-caption-medium text-slate-800">Bayar Sebelum</span>
        <span class="body-l-semibold text-error-700">{{ countdownDisplay }}</span>
      </div>

      <!-- Action Button -->
      <Button :variant="buttonVariant" size="sm" class="rounded-full" @click.stop="handleAction">
        {{ actionText }}
      </Button>
    </div>
  </div>
</template>
