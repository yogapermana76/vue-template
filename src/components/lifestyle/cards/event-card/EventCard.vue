<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { formatCurrency } from '@/utils/currency'
  import { Image } from '@/components/ui'

  export interface EventCardProps {
    /** Event image URL */
    image: string
    /** Event location */
    location: string
    /** Event title */
    title: string
    /** Event price */
    price: number
    /** Original price before discount (optional) */
    originalPrice?: number
    /** Discount percentage (optional) */
    discountPercentage?: number
    /** Whether the event is available (has stock) */
    inStock?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
    /** Click handler */
    onClick?: () => void
  }

  const props = withDefaults(defineProps<EventCardProps>(), {
    inStock: true,
  })

  const hasDiscount = computed(() => {
    return props.originalPrice && props.originalPrice > props.price && props.discountPercentage
  })

  const formattedPrice = computed(() => formatCurrency(props.price))

  const formattedOriginalPrice = computed(() => {
    if (!props.originalPrice) return ''
    return formatCurrency(props.originalPrice)
  })
</script>

<template>
  <div
    :class="
      cn('flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200', props.class)
    "
    role="button"
    :tabindex="onClick ? 0 : undefined"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space.prevent="onClick"
  >
    <!-- Image Section -->
    <div class="relative h-42.75 w-full overflow-hidden">
      <Image
        :src="image"
        :alt="title"
        container-class="h-full w-full"
        class="h-full w-full object-cover"
        :class="{ 'opacity-50 grayscale': !inStock }"
      />
    </div>

    <!-- Content Section -->
    <div class="flex items-start justify-between gap-0.5 bg-white px-4 py-3">
      <!-- Title Section -->
      <div class="flex flex-1 flex-col gap-0.5">
        <p class="body-caption" :class="inStock ? 'text-neutral-500' : 'text-slate-500'">
          {{ location }}
        </p>
        <h3
          class="body-m-semibold line-clamp-1"
          :class="inStock ? 'text-neutral-900' : 'text-slate-500'"
        >
          {{ title }}
        </h3>
      </div>

      <!-- Price Section -->
      <div class="flex flex-col items-end justify-center gap-0.5">
        <!-- Original Price & Discount Badge -->
        <div v-if="hasDiscount && inStock" class="flex items-center justify-end gap-1">
          <span class="body-small text-neutral-500 line-through">
            {{ formattedOriginalPrice }}
          </span>
          <div class="flex items-center justify-center rounded-full bg-red-100 px-1 py-0.5">
            <span class="text-[6px] leading-2 font-bold text-red-600">
              {{ discountPercentage }}%
            </span>
          </div>
        </div>

        <!-- Current Price -->
        <p
          class="body-l-semibold whitespace-nowrap"
          :class="inStock ? 'text-orange-500' : 'text-slate-500'"
        >
          {{ formattedPrice }}
        </p>
      </div>
    </div>
  </div>
</template>
