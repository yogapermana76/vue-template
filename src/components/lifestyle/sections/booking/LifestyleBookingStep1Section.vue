<script setup lang="ts">
  import { Divider } from '@/components/ui/divider'
  import { AlertBox } from '@/components/ui/alert'
  import {
    LifestyleTicketCategorySection,
    LifestyleDateSelectionSection,
    LifestyleTicketQuantitySection,
  } from '@/components/lifestyle/sections/ticket'

  const ALERT_MESSAGES = [
    'Maksimum jumlah tiket yang dapat dibeli 5',
    'Perhatikan barang bawaan Anda',
    'Dilarang membawa makanan',
  ] as const

  export interface SelectedQuantity {
    ticketId: number
    quantity: number
  }

  export interface LifestyleBookingStep1SectionProps {
    /** Program/Event ID */
    programId: string
    /** Event title */
    eventTitle: string
    /** Selected ticket category ID */
    selectedTicketCategoryId: string | null
    /** Selected visit date (ISO format) */
    selectedDate: string | null
    /** Selected quantities from form state */
    selectedQuantities: SelectedQuantity[]
  }

  defineProps<LifestyleBookingStep1SectionProps>()

  export interface TicketData {
    ticketId: number
    ticketName: string
    price: number
    remainingQuota: number
  }

  const emit = defineEmits<{
    'ticket-category-selected': [ticketCategoryId: string]
    'date-selected': [date: string]
    'ticket-quantity-changed': [ticketId: number, quantity: number, ticketData: TicketData]
  }>()

  const handleTicketCategorySelected = (ticketCategoryId: string) => {
    emit('ticket-category-selected', ticketCategoryId)
  }

  const handleDateSelected = (date: string) => {
    emit('date-selected', date)
  }

  const handleTicketQuantityChange = (
    ticketId: number,
    quantity: number,
    ticketData: TicketData,
  ) => {
    emit('ticket-quantity-changed', ticketId, quantity, ticketData)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="heading-s px-4 text-slate-950">{{ eventTitle }}</h1>

    <div class="px-4">
      <LifestyleTicketCategorySection
        :program-id="programId"
        :selected-id="selectedTicketCategoryId"
        @ticket-category-selected="handleTicketCategorySelected"
      />
    </div>

    <Divider thick />

    <div class="px-4">
      <LifestyleDateSelectionSection
        :program-id="programId"
        :selected-date="selectedDate"
        @date-selected="handleDateSelected"
      />
    </div>

    <Divider thick />

    <div class="px-4">
      <LifestyleTicketQuantitySection
        :program-id="programId"
        :selected-ticket-category-id="selectedTicketCategoryId"
        :selected-date="selectedDate"
        :selected-quantities="selectedQuantities"
        @ticket-quantity-change="handleTicketQuantityChange"
      />
    </div>

    <Divider thick />

    <div class="px-4">
      <AlertBox variant="info" title="Informasi Tambahan">
        <ol class="body-caption text-primary-800 ml-4 list-decimal">
          <li v-for="(message, index) in ALERT_MESSAGES" :key="index">
            {{ message }}
          </li>
        </ol>
      </AlertBox>
    </div>
  </div>
</template>
