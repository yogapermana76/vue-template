<script setup lang="ts">
  import { Image } from '@/components/ui/image'

  export interface OrderSummaryCardProps {
    /** Event image URL */
    imageSrc: string
    /** Event date */
    date: string
    /** Event title */
    title: string
    /** Ticket details (e.g., "Reguler • 2 Dewasa • 1 Anak") */
    details: string
  }

  defineProps<OrderSummaryCardProps>()
</script>

<template>
  <div
    class="flex w-full flex-col items-start gap-3 rounded-sm border border-neutral-200 bg-white p-3"
  >
    <!-- Event Image & Info -->
    <div class="flex w-full items-start gap-3">
      <!-- Event Image -->
      <Image
        :src="imageSrc"
        :alt="title"
        aspect-ratio="1/1"
        object-fit="cover"
        container-class="size-16 shrink-0 rounded-sm"
        class="rounded-sm"
      />

      <!-- Event Info -->
      <div class="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span class="body-m text-primary-600">{{ date }}</span>
        <h3 class="body-l-semibold line-clamp-2 self-stretch text-slate-950">{{ title }}</h3>
        <span class="body-caption self-stretch text-slate-950">{{ details }}</span>
      </div>
    </div>
  </div>
</template>
