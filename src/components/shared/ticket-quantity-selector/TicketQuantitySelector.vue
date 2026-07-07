<script setup lang="ts">
  import { computed } from 'vue'
  import { Clock, X } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { formatCurrency } from '@/utils/currency'
  import { NumberStepper } from '@/components/ui/number-stepper'
  import { Badge } from '@/components/ui/badge'

  interface TicketQuantitySelectorProps {
    modelValue?: number
    label: string
    price: number | string
    /** Original price before discount (used for strikethrough) */
    originalPrice?: number
    /** Discount value — if > 0, shows strikethrough + badge */
    discountValue?: number
    /** Discount type: '%' for percentage, 'Rp' for fixed amount */
    discountCostType?: '%' | 'Rp' | string | null
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    comingSoon?: boolean
    saleEnded?: boolean
    soldOut?: boolean
    class?: string
  }

  interface TicketQuantitySelectorEmits {
    (e: 'update:modelValue', value: number): void
    (e: 'increment', value: number): void
    (e: 'decrement', value: number): void
    (e: 'change', value: number): void
  }

  const props = withDefaults(defineProps<TicketQuantitySelectorProps>(), {
    modelValue: 0,
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    disabled: false,
    comingSoon: false,
    saleEnded: false,
    soldOut: false,
  })

  const emit = defineEmits<TicketQuantitySelectorEmits>()

  const isFree = computed(() => props.price === 0)

  const hasDiscount = computed(
    () => (props.discountValue ?? 0) > 0 && props.originalPrice && props.originalPrice > 0,
  )

  const formattedPrice = computed(() => {
    if (isFree.value) return 'Gratis'
    if (typeof props.price === 'string') return props.price
    return formatCurrency(props.price)
  })

  const formattedOriginalPrice = computed(() =>
    props.originalPrice ? formatCurrency(props.originalPrice) : '',
  )

  const discountBadgeLabel = computed(() => {
    if (!props.discountValue) return ''
    if (props.discountCostType === 'Rp') return formatCurrency(props.discountValue)
    return `${props.discountValue}%`
  })

  const handleUpdate = (value: number) => emit('update:modelValue', value)
  const handleIncrement = (value: number) => emit('increment', value)
  const handleDecrement = (value: number) => emit('decrement', value)
  const handleChange = (value: number) => emit('change', value)

  const containerClasses = computed(() =>
    cn('flex flex-row justify-between items-center gap-2', 'w-full', props.class),
  )
</script>

<template>
  <div :class="containerClasses" data-slot="ticket-quantity-selector">
    <!-- Label Section -->
    <div class="flex flex-col items-start justify-center gap-0.5">
      <!-- Ticket Type Label -->
      <span class="leading-xs text-xs font-normal text-slate-800/75">
        {{ label }}
      </span>

      <!-- Price row: final price + strikethrough + badge — all in one line -->
      <div class="flex items-center gap-1">
        <span class="leading-xs text-xs font-bold text-slate-950">
          {{ formattedPrice }}
        </span>
        <template v-if="hasDiscount">
          <span class="body-small font-normal text-slate-500 line-through">
            {{ formattedOriginalPrice }}
          </span>
          <Badge
            class="h-3 rounded-full border-none bg-red-100 px-1 py-0 text-[6px] leading-2 font-bold text-red-600"
          >
            {{ discountBadgeLabel }}
          </Badge>
        </template>
      </div>
    </div>

    <!-- Coming Soon -->
    <span v-if="comingSoon" class="body-caption-medium text-slate-500">Coming Soon</span>

    <!-- Penjualan Berakhir (Sale Ended) -->
    <div v-else-if="saleEnded" class="flex flex-row items-center gap-1">
      <Clock class="size-4 shrink-0 text-slate-500" />
      <span class="body-caption-medium text-slate-500">Penjualan Berakhir</span>
    </div>

    <!-- Habis (Sold Out) -->
    <div v-else-if="!comingSoon && soldOut" class="flex flex-row items-center gap-1">
      <X class="size-4 shrink-0 text-red-500" />
      <span class="body-caption-medium text-red-700">Habis</span>
    </div>

    <!-- Number Stepper -->
    <NumberStepper
      v-else
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      @update:model-value="handleUpdate"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @change="handleChange"
    />
  </div>
</template>
