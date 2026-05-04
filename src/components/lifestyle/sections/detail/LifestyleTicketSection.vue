<script setup lang="ts">
  import {
    TicketCategoryCard,
    type TicketCategoryCardBenefit,
  } from '@/components/lifestyle/cards/ticket-category-card'

  export interface TicketCategory {
    id: string
    category: string
    benefits: TicketCategoryCardBenefit[]
    price: number
    originalPrice?: number
    discountPercentage?: number
    variant?: 'regular' | 'vip'
    available?: boolean
    buttonLabel?: string
  }

  interface Props {
    title?: string
    tickets: TicketCategory[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Pilih Tiket',
  })

  const emit = defineEmits<{
    select: [ticketId: string]
    detail: [ticketId: string]
  }>()
</script>

<template>
  <section class="flex flex-col gap-3 px-4">
    <h2 class="body-l-semibold text-slate-950">{{ title }}</h2>

    <TicketCategoryCard
      v-for="ticket in tickets"
      :key="ticket.id"
      :category="ticket.category"
      :benefits="ticket.benefits"
      :price="ticket.price"
      :original-price="ticket.originalPrice"
      :discount-percentage="ticket.discountPercentage"
      :variant="ticket.variant || 'regular'"
      :available="ticket.available !== false"
      :button-label="ticket.buttonLabel"
      @select="emit('select', ticket.id)"
      @detail="emit('detail', ticket.id)"
    />
  </section>
</template>
