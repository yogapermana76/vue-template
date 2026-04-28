<script setup lang="ts">
  import { computed } from 'vue'
  import { TicketQuantitySelector } from '@/components/lifestyle/ticket-quantity-selector'
  import { getMockPricing } from '@/mocks/lifestyle/ticket-data'

  export interface AvailableTicketOption {
    ticketId: number
    ticketName: string
    label: string
    price: number
    remainingQuota: number
  }

  export interface SelectedTicketQuantity {
    ticketId: number
    quantity: number
  }

  export interface LifestyleTicketQuantitySectionProps {
    /** Section title */
    title?: string
    /** Program/Event ID to fetch available tickets */
    programId?: string
    /** Selected quantities from form */
    selectedQuantities: SelectedTicketQuantity[]
    /** Max total quantity across all ticket types */
    maxTotalQuantity?: number
  }

  const props = withDefaults(defineProps<LifestyleTicketQuantitySectionProps>(), {
    title: 'Total Pembelian Tiket',
    maxTotalQuantity: 5,
  })

  defineEmits<{
    'ticket-quantity-change': [ticketId: number, quantity: number]
  }>()

  // Fetch available tickets based on programId
  // TODO: Replace with actual API call using composable
  const pricing = getMockPricing()
  const availableTickets: AvailableTicketOption[] = [
    {
      ticketId: 1,
      ticketName: 'Adult',
      label: 'Dewasa (16+ Tahun)',
      price: pricing.adultPrice,
      remainingQuota: 100,
    },
    {
      ticketId: 2,
      ticketName: 'Child',
      label: 'Anak-Anak (3-15 Tahun)',
      price: pricing.childPrice,
      remainingQuota: 100,
    },
  ]

  // Merge available tickets with selected quantities
  const ticketsWithQuantities = computed(() => {
    return availableTickets.map(ticket => ({
      ...ticket,
      quantity: props.selectedQuantities.find(q => q.ticketId === ticket.ticketId)?.quantity || 0,
    }))
  })
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="body-l-semibold text-slate-950">{{ title }}</h2>
    <div class="flex flex-col gap-4">
      <TicketQuantitySelector
        v-for="ticket in ticketsWithQuantities"
        :key="ticket.ticketId"
        :model-value="ticket.quantity"
        :label="ticket.label"
        :price="ticket.price"
        :max="ticket.remainingQuota || maxTotalQuantity"
        @update:model-value="$emit('ticket-quantity-change', ticket.ticketId, $event)"
      />
    </div>
  </section>
</template>
