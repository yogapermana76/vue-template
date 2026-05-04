<script setup lang="ts">
  import { computed } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination } from 'swiper/modules'
  import { SwiperPagination } from '@/components/ui/swiper'
  import {
    TicketCategorySelectionCard,
    type TicketCategorySelectionCardFeature,
  } from '@/components/lifestyle/cards/ticket-category-selection-card'
  import { getMockProgramTicketCategories } from '@/mocks/lifestyle/ticket-data'

  export interface ProgramTicketCategory {
    id: string
    title: string
    features: TicketCategorySelectionCardFeature[]
  }

  export interface LifestyleTicketCategorySectionProps {
    /** Program/Event ID to fetch ticket categories */
    programId?: string
    /** Selected ticket category ID */
    selectedId: string | null
  }

  defineProps<LifestyleTicketCategorySectionProps>()

  defineEmits<{
    'ticket-category-selected': [ticketCategoryId: string]
  }>()

  const modules = [Pagination]

  // Fetch ticket categories based on programId
  // TODO: Replace with actual API call using composable
  const ticketCategories = getMockProgramTicketCategories()

  const needsSwiper = computed(() => ticketCategories.length > 1)

  function handleTicketDetail(ticketCategoryId: string) {
    // TODO: Open ticket detail modal
    // eslint-disable-next-line no-console
    console.log('Open ticket detail for:', ticketCategoryId)
  }
</script>

<template>
  <!-- Single Ticket Category -->
  <section v-if="!needsSwiper" class="flex flex-col gap-3">
    <TicketCategorySelectionCard
      :title="ticketCategories[0].title"
      :features="ticketCategories[0].features"
      :selected="selectedId === ticketCategories[0].id"
      :selectable="true"
      @click="$emit('ticket-category-selected', ticketCategories[0].id)"
      @detail="handleTicketDetail(ticketCategories[0].id)"
    />
  </section>

  <!-- Multiple Ticket Categories (Swiper) -->
  <section v-else class="flex flex-col gap-2">
    <div class="-mx-4">
      <swiper
        :modules="modules"
        :slides-per-view="1.2"
        :space-between="12"
        :slides-offset-before="16"
        :slides-offset-after="16"
        :pagination="{ clickable: true, el: '#swiper-pagination-ticket-categories' }"
      >
        <swiper-slide v-for="ticketCategory in ticketCategories" :key="ticketCategory.id">
          <TicketCategorySelectionCard
            :title="ticketCategory.title"
            :features="ticketCategory.features"
            :selected="selectedId === ticketCategory.id"
            :selectable="true"
            @click="$emit('ticket-category-selected', ticketCategory.id)"
            @detail="handleTicketDetail(ticketCategory.id)"
          />
        </swiper-slide>
      </swiper>
    </div>

    <SwiperPagination id="swiper-pagination-ticket-categories" variant="small" color="primary" />
  </section>
</template>
