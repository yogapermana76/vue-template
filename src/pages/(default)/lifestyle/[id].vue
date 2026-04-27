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
  import type { DatePickerCardProps } from '@/components/lifestyle/cards/date-picker'

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

  // Selected date state
  const selectedDateIndex = ref(0)

  // Mock event data - replace with actual API call
  const eventData = ref({
    id: eventId.value,
    title: 'PLN Mobile Gelegar Musik Prambanan 2024',
    imageUrl: 'https://picsum.photos/375/187',
    type: 'Musik',
    dateRange: 'Kamis - Sabtu, 23 - 25 Mei 2024',
    time: '18:00 - 23:00 WIB',
    location: {
      name: 'Komplek Candi Prambanan',
      address:
        'Jl. Raya Solo - Yogyakarta No.16, Kranggan, Bokoharjo, Kec. Prambanan, Kabupaten Sleman, Daerah Istimew...',
    },
    alertMessage: 'Anda hanya dapat membeli maksimal 5 tiket.',
    description:
      'PLN Mobile Kembali mempersembahkan konser musik bertajuk PLN Mobile Gelegar Musik Prambanan 2024. Acara yang digelar di Kawasan Candi Prambanan ini akan dimeriahkan...',
  })

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

  // Mock dates data
  const availableDates = ref<DatePickerCardProps[]>([
    {
      dayName: 'Kamis',
      date: 23,
      month: 'MEI',
      year: 2024,
      available: true,
    },
    {
      dayName: 'Jumat',
      date: 24,
      month: 'MEI',
      year: 2024,
      available: true,
    },
    {
      dayName: 'Sabtu',
      date: 25,
      month: 'MEI',
      year: 2024,
      available: false,
      statusLabel: 'Habis',
    },
  ])

  // Mock ticket categories
  const ticketCategories = ref<TicketCategory[]>([
    {
      id: 'regular',
      category: 'Reguler',
      benefits: [{ text: 'Tiket masuk Acara' }, { text: 'Sticker Make A Wish' }],
      price: 300000,
      variant: 'regular',
      available: true,
    },
    {
      id: 'vip',
      category: 'VIP',
      benefits: [
        { text: 'Tiket masuk Acara' },
        { text: 'Sticker Make A Wish' },
        { text: 'Special Entry' },
        { text: 'Backstage Pass' },
      ],
      price: 300000,
      variant: 'vip',
      available: false,
    },
  ])

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

    <!-- Divider -->
    <Divider thick />

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
