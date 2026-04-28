<script setup lang="ts">
  import { Divider } from '@/components/ui/divider'
  import { AlertBox } from '@/components/ui/alert'
  import {
    LifestyleTicketTypeSection,
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
    /** Selected ticket type ID */
    selectedTicketTypeId: string | null
    /** Selected visit date (ISO format) */
    selectedDate: string | null
    /** Selected quantities from form state */
    selectedQuantities: SelectedQuantity[]
  }

  defineProps<LifestyleBookingStep1SectionProps>()

  defineEmits<{
    'ticket-type-selected': [ticketTypeId: string]
    'date-selected': [date: string]
    'ticket-quantity-changed': [ticketId: number, quantity: number]
  }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="heading-s px-4 text-slate-950">{{ eventTitle }}</h1>

    <div class="px-4">
      <LifestyleTicketTypeSection
        :program-id="programId"
        :selected-id="selectedTicketTypeId"
        @ticket-type-selected="id => $emit('ticket-type-selected', id)"
      />
    </div>

    <Divider thick />

    <div class="px-4">
      <LifestyleDateSelectionSection
        :program-id="programId"
        :selected-date="selectedDate"
        @date-selected="date => $emit('date-selected', date)"
      />
    </div>

    <Divider thick />

    <div class="px-4">
      <LifestyleTicketQuantitySection
        :program-id="programId"
        :selected-quantities="selectedQuantities"
        @ticket-quantity-change="
          (ticketId, quantity) => $emit('ticket-quantity-changed', ticketId, quantity)
        "
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
