<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Share2, RefreshCw, Phone, Info } from 'lucide-vue-next'
  import { Header, HeroBanner } from '@/components/layout'
  import { Button, IconButton } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { AlertBox } from '@/components/ui/alert'
  import {
    EventDetailsCard,
    LifestyleDatePickerSection,
    LifestyleTicketSection,
    LifestyleDescriptionSection,
    LifestyleMoreSection,
    type EventDetailItem,
    type TicketCategory,
    type LifestyleMoreItem,
  } from '@/components/lifestyle/sections'
  import {
    getMockEventData,
    getMockAvailableDates,
    getMockProgramTicketCategories,
  } from '@/mocks/lifestyle/ticket-data'

  definePage({
    meta: {
      title: 'Detail Event',
    },
  })

  const route = useRoute()
  const router = useRouter()

  // Get ID from route params
  const eventId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })

  // Mock data (TODO: Replace with API integration)
  const eventData = ref(getMockEventData(eventId.value))
  const availableDates = ref(getMockAvailableDates())
  const ticketTypes = ref(getMockProgramTicketCategories())

  // Selected date state
  const selectedDateIndex = ref(0)

  // Event detail items for EventDetailsCard
  const eventDetailItems = computed<EventDetailItem[]>(() => [
    {
      id: 'type',
      label: 'Jenis Event',
      value: eventData.value.type,
    },
    {
      id: 'date',
      label: 'Tanggal & Waktu Event:',
      useSlot: true,
    },
    {
      id: 'location',
      label: 'Lokasi Event:',
      useSlot: true,
    },
  ])

  // Transform ticketTypes to ticketCategories format for LifestyleTicketSection
  const ticketCategories = computed<TicketCategory[]>(() => {
    return ticketTypes.value.map(ticket => ({
      id: ticket.id,
      category: ticket.title,
      benefits: ticket.features,
      price: 300000, // TODO: Get from API ticket price
      variant: 'regular' as const,
      available: true,
    }))
  })

  // Information items for "Informasi Lainnya" section
  const informationItems = ref<LifestyleMoreItem[]>([
    {
      id: 'ticket-exchange',
      icon: RefreshCw,
      title: 'Penukaran Tiket',
      subtitle: 'Informasi penukaran tiket',
    },
    {
      id: 'contact',
      icon: Phone,
      title: 'Kontak',
      subtitle: 'Hubungi kami',
    },
    {
      id: 'facilities',
      icon: Info,
      title: 'Fasilitas Umum',
      subtitle: 'Informasi fasilitas',
    },
  ])

  // Handlers
  function handleShare() {
    // eslint-disable-next-line no-console
    console.log('Share clicked')
    // TODO: Implement share functionality
  }

  function handleOpenMap() {
    // eslint-disable-next-line no-console
    console.log('Open map')
    // TODO: Implement open map functionality
  }

  function handleDateSelect(index: number) {
    selectedDateIndex.value = index
  }

  function handleSelectTicket(ticketId: string) {
    // eslint-disable-next-line no-console
    console.log(
      'Selected ticket:',
      ticketId,
      'Navigating to:',
      `/lifestyle/ticket/${eventId.value}`,
    )
    // Navigate to ticket detail page
    router.push(`/lifestyle/ticket/${eventId.value}`)
  }

  function handleTicketDetail(ticketId: string) {
    // eslint-disable-next-line no-console
    console.log('View detail for:', ticketId)
    // TODO: Show ticket detail bottom sheet
  }

  function handleShowMoreDescription() {
    // eslint-disable-next-line no-console
    console.log('Show more description')
    // TODO: Show full description
  }

  function handleInformationClick(itemId: string) {
    // eslint-disable-next-line no-console
    console.log('Information clicked:', itemId)
    // TODO: Navigate to respective information page
  }
</script>

<template>
  <!-- Header -->
  <Header title="Detail Event" positioning="sticky">
    <template #actions="{ isDarkBg, iconClass }">
      <IconButton
        variant="tertiary"
        size="md"
        :is-dark-bg="isDarkBg"
        :class="iconClass"
        @click="handleShare"
      >
        <Share2 />
      </IconButton>
    </template>
  </Header>

  <!-- Hero Banner Section -->
  <HeroBanner :src="eventData.imageUrl" :alt="eventData.title" />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-4 pb-6">
    <!-- Title Section -->
    <section class="flex flex-col gap-1 px-4">
      <h1 class="heading-s text-slate-950">{{ eventData.title }}</h1>
    </section>

    <!-- Event Details Card -->
    <section class="px-4">
      <EventDetailsCard :items="eventDetailItems">
        <!-- Date Value -->
        <template #date-value>
          <div class="flex flex-col gap-1">
            <span class="body-m text-slate-950">
              {{ eventData.dateRange }}
            </span>
            <span class="body-caption text-slate-950">
              {{ eventData.time }}
            </span>
          </div>
        </template>

        <!-- Location Value -->
        <template #location-value>
          <div class="flex flex-col gap-1">
            <span class="body-m text-slate-950">
              {{ eventData.location.name }}
            </span>
            <span class="body-caption text-slate-950">
              {{ eventData.location.address }}
            </span>
            <Button variant="tertiary" size="xs" class="h-auto w-fit p-0" @click="handleOpenMap">
              Lihat Peta
            </Button>
          </div>
        </template>
      </EventDetailsCard>
    </section>

    <!-- Important Information Alert -->
    <section class="px-4">
      <AlertBox variant="info" title="Informasi Penting" :description="eventData.alertMessage" />
    </section>

    <!-- Divider -->
    <Divider thick />

    <!-- Date Picker Section -->
    <LifestyleDatePickerSection
      :dates="availableDates"
      :selected-index="selectedDateIndex"
      @select="handleDateSelect"
    />

    <!-- Ticket Category Section -->
    <LifestyleTicketSection
      :tickets="ticketCategories"
      @select="handleSelectTicket"
      @detail="handleTicketDetail"
    />

    <!-- Divider -->
    <Divider thick />

    <!-- Description Section -->
    <LifestyleDescriptionSection
      :description="eventData.description"
      @show-more="handleShowMoreDescription"
    />

    <!-- Divider -->
    <Divider thick />

    <!-- More Information Section -->
    <LifestyleMoreSection :items="informationItems" @item-click="handleInformationClick" />
  </main>
</template>
