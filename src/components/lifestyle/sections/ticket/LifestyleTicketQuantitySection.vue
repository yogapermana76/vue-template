<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { TicketQuantitySelector } from '@/components/shared/ticket-quantity-selector'
  import type { CategoryTicket } from '@/types/services/lifestyle/booking.types'

  /**
   * Available ticket option mapped from API CategoryTicket
   */
  export interface AvailableTicketOption {
    ticketId: number
    ticketName: string
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
    /** Program/Event ID */
    programId: string
    /** Selected ticket category ID */
    selectedTicketCategoryId: string | null
    /** Selected visit date */
    selectedDate: string | null
    /** Selected quantities from form */
    selectedQuantities: SelectedTicketQuantity[]
    /** Max total quantity across all ticket types */
    maxTotalQuantity?: number
  }

  const props = withDefaults(defineProps<LifestyleTicketQuantitySectionProps>(), {
    title: 'Total Pembelian Tiket',
    maxTotalQuantity: 5,
  })

  const emit = defineEmits<{
    'ticket-quantity-change': [
      ticketId: number,
      quantity: number,
      ticketData: AvailableTicketOption,
    ]
  }>()

  // ============================================================================
  // API Integration - Fetch Available Tickets
  // ============================================================================

  // TODO: Replace with actual API call using composable
  // Example:
  // const { data: availableTickets, isLoading } = useQuery({
  //   queryKey: ['categoryTickets', props.programId, props.selectedTicketTypeId, props.selectedDate],
  //   queryFn: () => lifestyleApi.getCategoryTickets({
  //     programId: props.programId,
  //     programCategoryId: props.selectedTicketTypeId,
  //     visitDate: props.selectedDate,
  //   }),
  //   enabled: computed(() => !!props.selectedTicketTypeId && !!props.selectedDate),
  // })

  const availableTickets = ref<CategoryTicket[]>([
    {
      ticketId: 241,
      ticketName: 'Regular Ticket',
      programTicketCategoryId: 195,
      startVisitDate: '2026-03-02',
      startVisitTime: '10:00:00',
      endVisitDate: '2026-04-30',
      endVisitTime: '23:00:00',
      saleStartDatetime: '2026-03-01T10:00:00',
      saleEndDatetime: '2026-04-30T23:00:00',
      priceDetail: {
        basePrice: 50000,
        partnershipCost: 0,
        listingPrice: 50000,
        platformCost: 0,
        entertainmentTax: 0,
        ppnTax: 0,
        discountValue: 0,
        discountCostType: null,
        discount: 0,
        finalPrice: 50000,
      },
      quota: 100,
      quotaUsed: 1,
      remainingQuota: 99,
    },
    {
      ticketId: 246,
      ticketName: 'VIP Ticket',
      programTicketCategoryId: 195,
      startVisitDate: '2026-03-02',
      startVisitTime: '10:00:00',
      endVisitDate: '2026-04-30',
      endVisitTime: '23:00:00',
      saleStartDatetime: '2026-04-01T10:00:00',
      saleEndDatetime: '2026-04-30T23:00:00',
      priceDetail: {
        basePrice: 219500,
        partnershipCost: 10000,
        listingPrice: 190000,
        platformCost: 10000,
        entertainmentTax: 9500,
        ppnTax: 10000,
        discountValue: 0,
        discountCostType: null,
        discount: 0,
        finalPrice: 219500,
      },
      quota: 10,
      quotaUsed: 3,
      remainingQuota: 7,
    },
  ])

  // Watch for changes in ticket category or date to refetch tickets
  watch(
    () => [props.selectedTicketCategoryId, props.selectedDate],
    () => {
      // TODO: Trigger API refetch when ticket category or date changes
      // This will automatically update availableTickets
    },
  )

  /**
   * Map API tickets to internal format
   */
  const mappedTickets = computed<AvailableTicketOption[]>(() => {
    return availableTickets.value.map(ticket => ({
      ticketId: ticket.ticketId,
      ticketName: ticket.ticketName,
      price: ticket.priceDetail.finalPrice,
      remainingQuota: ticket.remainingQuota,
    }))
  })

  /**
   * Merge available tickets with selected quantities
   */
  const ticketsWithQuantities = computed(() => {
    return mappedTickets.value.map(ticket => ({
      ...ticket,
      quantity: props.selectedQuantities.find(q => q.ticketId === ticket.ticketId)?.quantity || 0,
    }))
  })

  /**
   * Handle ticket quantity change
   */
  function handleQuantityChange(
    ticket: AvailableTicketOption & { quantity: number },
    newQuantity: number,
  ) {
    emit('ticket-quantity-change', ticket.ticketId, newQuantity, {
      ticketId: ticket.ticketId,
      ticketName: ticket.ticketName,
      price: ticket.price,
      remainingQuota: ticket.remainingQuota,
    })
  }
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="body-l-semibold text-slate-950">{{ title }}</h2>
    <div class="flex flex-col gap-4">
      <TicketQuantitySelector
        v-for="ticket in ticketsWithQuantities"
        :key="ticket.ticketId"
        :model-value="ticket.quantity"
        :label="ticket.ticketName"
        :price="ticket.price"
        :max="ticket.remainingQuota || maxTotalQuantity"
        @update:model-value="handleQuantityChange(ticket, $event)"
      />
    </div>
  </section>
</template>
