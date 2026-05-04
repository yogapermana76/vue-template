<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { formatCurrency } from '@/utils/currency'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { Check } from 'lucide-vue-next'

  export interface TicketCategoryCardBenefit {
    /** Benefit text */
    text: string
  }

  export interface TicketCategoryCardProps {
    /** Ticket category name (e.g., "Reguler", "VIP") */
    category: string
    /** Ticket benefits list */
    benefits: TicketCategoryCardBenefit[]
    /** Ticket price */
    price: number
    /** Original price before discount (optional) */
    originalPrice?: number
    /** Discount percentage (optional) */
    discountPercentage?: number
    /** Button label */
    buttonLabel?: string
    /** Whether the ticket is available */
    available?: boolean
    /** Ticket variant - changes header background color */
    variant?: 'regular' | 'vip'
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<TicketCategoryCardProps>(), {
    buttonLabel: 'Pilih Tiket',
    available: true,
    variant: 'regular',
  })

  const emit = defineEmits<{
    /** Emitted when the select button is clicked */
    select: []
    /** Emitted when the detail link is clicked */
    detail: []
  }>()

  const hasDiscount = computed(() => {
    return props.originalPrice && props.originalPrice > props.price && props.discountPercentage
  })

  const formattedPrice = computed(() => formatCurrency(props.price))

  const formattedOriginalPrice = computed(() => {
    if (!props.originalPrice) return ''
    return formatCurrency(props.originalPrice)
  })

  const headerBackgroundClass = computed(() => {
    if (!props.available) {
      return 'bg-primary-800 mix-blend-luminosity'
    }
    return props.variant === 'vip' ? 'bg-tertiary-600' : 'bg-primary-800'
  })

  const handleSelectClick = () => {
    if (props.available) {
      emit('select')
    }
  }

  const handleDetailClick = (event: Event) => {
    event.stopPropagation()
    emit('detail')
  }
</script>

<template>
  <div
    data-slot="ticket-category-card"
    :class="
      cn(
        'relative flex w-full flex-col items-center gap-2 overflow-visible rounded-sm px-0 pt-2 pb-0',
        headerBackgroundClass,
        props.class,
      )
    "
  >
    <!-- Decorative gradient background (top) -->
    <div
      class="pointer-events-none absolute top-[-112.78px] left-40 isolate size-46 overflow-hidden"
      aria-hidden="true"
    >
      <!-- Gradient Vector 1 -->
      <div
        class="absolute top-1/2 left-1/2 h-[218.2px] w-[131.27px] -translate-x-[calc(50%-57px)] -translate-y-[calc(50%+94.15px)] opacity-20"
        :style="{
          background:
            'linear-gradient(131.12deg, rgba(255, 255, 255, 0.2) -8.15%, rgba(255, 255, 255, 0) 17.97%, rgba(255, 255, 255, 0.4) 44.1%, rgba(255, 255, 255, 0) 65.95%, rgba(255, 255, 255, 0.7) 80.47%, rgba(255, 255, 255, 0) 102.74%)',
          transform: 'rotate(14.31deg)',
        }"
      />

      <!-- Gradient Vector 2 (border) -->
      <div
        class="absolute top-1/2 left-1/2 h-[218.2px] w-[131.27px] -translate-x-[calc(50%-54.13px)] -translate-y-[calc(50%+101.68px)] opacity-70"
        :style="{ transform: 'rotate(14.31deg)' }"
      />
    </div>

    <!-- Header Section -->
    <div class="relative z-10 flex w-full items-center justify-between px-6">
      <!-- Ticket Category Title -->
      <h3 class="body-l-semibold flex-1 text-white">{{ category }}</h3>

      <!-- Detail Link -->
      <button
        type="button"
        class="body-caption-semibold flex items-center justify-center px-0 py-2 text-white transition-opacity hover:opacity-80"
        @click="handleDetailClick"
      >
        Detail
      </button>
    </div>

    <!-- Content Card -->
    <div
      class="bg-primary-50 relative z-20 flex w-full flex-col items-center justify-center gap-0.5 self-stretch rounded-sm px-0 py-3"
    >
      <!-- Information Section -->
      <div class="flex w-full flex-col gap-1 px-4">
        <!-- Section Title -->
        <p class="body-caption text-slate-950">Apa yang didapatkan:</p>

        <!-- Benefits List -->
        <div class="flex flex-col gap-1">
          <div v-for="(benefit, index) in benefits" :key="index" class="flex items-center gap-1">
            <!-- Checkmark Icon -->
            <Check
              :class="cn('size-4 shrink-0', available ? 'text-primary-600' : 'text-primary-500')"
            />
            <!-- Benefit Text -->
            <span
              :class="cn('body-caption flex-1', available ? 'text-slate-800' : 'text-neutral-800')"
            >
              {{ benefit.text }}
            </span>
          </div>
        </div>
      </div>

      <!-- Divider with circles (ticket perforation effect) -->
      <div class="relative h-5 w-full overflow-hidden">
        <!-- Left Circle -->
        <div
          class="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-white"
          aria-hidden="true"
        />

        <!-- Divider Line -->
        <div class="flex h-full items-center">
          <Divider variant="dashed" orientation="horizontal" class="w-full" />
        </div>

        <!-- Right Circle -->
        <div
          class="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-white"
          aria-hidden="true"
        />
      </div>

      <!-- Price & Button Section -->
      <div class="flex w-full items-center justify-between gap-2.5 px-4">
        <!-- Price Container -->
        <div class="flex flex-col items-start justify-end gap-0.5">
          <!-- Original Price & Discount (if available) -->
          <div v-if="hasDiscount && available" class="flex items-center gap-1">
            <span
              class="text-xxs leading-3.5 font-normal"
              :style="{ color: 'rgba(29, 41, 61, 0.75)' }"
            >
              {{ formattedOriginalPrice }}
            </span>
          </div>

          <!-- Final Price -->
          <div class="flex flex-col">
            <span v-if="!available" class="body-caption text-slate-500">Mulai dari</span>
            <p class="body-l-semibold" :class="available ? 'text-secondary-700' : 'text-slate-500'">
              {{ formattedPrice }}
            </p>
          </div>
        </div>

        <!-- Action Button -->
        <Button variant="primary" size="xs" :disabled="!available" @click="handleSelectClick">
          {{ available ? buttonLabel : 'Habis' }}
        </Button>
      </div>
    </div>
  </div>
</template>
