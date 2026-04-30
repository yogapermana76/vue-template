<script setup lang="ts">
  import { computed } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination } from 'swiper/modules'
  import { SwiperPagination } from '@/components/ui/swiper'
  import {
    TicketTypeCard,
    type TicketTypeCardFeature,
  } from '@/components/lifestyle/cards/ticket-type-card'
  import { getMockTicketTypes } from '@/mocks/lifestyle/ticket-data'

  export interface TicketType {
    id: string
    title: string
    features: TicketTypeCardFeature[]
  }

  export interface LifestyleTicketTypeSectionProps {
    /** Program/Event ID to fetch ticket types */
    programId?: string
    /** Selected ticket type ID */
    selectedId: string | null
  }

  defineProps<LifestyleTicketTypeSectionProps>()

  defineEmits<{
    'ticket-type-selected': [ticketTypeId: string]
  }>()

  const modules = [Pagination]

  // Fetch ticket types based on programId
  // TODO: Replace with actual API call using composable
  const ticketTypes = getMockTicketTypes()

  const needsSwiper = computed(() => ticketTypes.length > 1)

  function handleTicketDetail(ticketTypeId: string) {
    // TODO: Open ticket detail modal
    // eslint-disable-next-line no-console
    console.log('Open ticket detail for:', ticketTypeId)
  }
</script>

<template>
  <!-- Single Ticket Type -->
  <section v-if="!needsSwiper" class="flex flex-col gap-3">
    <TicketTypeCard
      :title="ticketTypes[0].title"
      :features="ticketTypes[0].features"
      :selected="selectedId === ticketTypes[0].id"
      :selectable="true"
      @click="$emit('ticket-type-selected', ticketTypes[0].id)"
      @detail="handleTicketDetail(ticketTypes[0].id)"
    />
  </section>

  <!-- Multiple Ticket Types (Swiper) -->
  <section v-else class="flex flex-col gap-2">
    <div class="-mx-4">
      <swiper
        :modules="modules"
        :slides-per-view="1.2"
        :space-between="12"
        :slides-offset-before="16"
        :slides-offset-after="16"
        :pagination="{ clickable: true, el: '#swiper-pagination-ticket-types' }"
      >
        <swiper-slide v-for="ticketType in ticketTypes" :key="ticketType.id">
          <TicketTypeCard
            :title="ticketType.title"
            :features="ticketType.features"
            :selected="selectedId === ticketType.id"
            :selectable="true"
            @click="$emit('ticket-type-selected', ticketType.id)"
            @detail="handleTicketDetail(ticketType.id)"
          />
        </swiper-slide>
      </swiper>
    </div>

    <SwiperPagination id="swiper-pagination-ticket-types" variant="small" color="primary" />
  </section>
</template>
