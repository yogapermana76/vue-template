<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { ChevronDown } from 'lucide-vue-next'
  import { Header, Footer } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { Progress } from '@/components/ui/progress'
  import { Divider } from '@/components/ui/divider'
  import { OrderSummaryCard } from '@/components/lifestyle/cards/order-summary-card'
  import {
    LifestyleBookingStep1Section,
    LifestyleBookingStep2Section,
    LifestyleBookingStep3Section,
  } from '@/components/lifestyle/sections/booking'
  import type { PaymentBreakdown, VisitorInfo } from '@/components/lifestyle/sections/order'
  import { useSwiperStyles } from '@/composables/ui/useSwiperStyles'
  import { getMockEventData, getMockUserData, getMockPricing } from '@/mocks/lifestyle/ticket-data'
  import { formatCurrency } from '@/utils/currency'
  import { authStorage } from '@/utils/storage/auth'
  import type { LifestyleCreateBookingRequest } from '@/types/services/lifestyle/booking.types'

  useSwiperStyles()

  // ============================================================================
  // Constants
  // ============================================================================

  const BOOKING_STEPS = {
    TICKET_SELECTION: 1,
    ORDER_INFO: 2,
    PAYMENT: 3,
  } as const

  type BookingStep = (typeof BOOKING_STEPS)[keyof typeof BOOKING_STEPS]

  const TOTAL_STEPS = 3

  const STEP_TITLES = {
    [BOOKING_STEPS.TICKET_SELECTION]: 'Detail Tiket',
    [BOOKING_STEPS.ORDER_INFO]: 'Isi Data Diri',
    [BOOKING_STEPS.PAYMENT]: 'Detail Tagihan',
  } as const

  const STEP_BUTTON_LABELS = {
    NEXT: 'Selanjutnya',
    PAY: 'Bayar',
  } as const

  // ============================================================================
  // Validation Schemas
  // ============================================================================

  const ticketQuantitySchema = z.object({
    ticketId: z.number(),
    ticketName: z.string(),
    quantity: z.number().min(0, 'Jumlah tiket tidak boleh negatif'),
    finalPrice: z.number(),
    remainingQuota: z.number().optional(),
  })

  const ticketSelectionSchema = z
    .object({
      selectedTicketCategoryId: z.number().min(0, 'Kategori tiket harus dipilih'),
      visitDate: z.string().min(1, 'Tanggal kunjungan harus dipilih'),
      ticketQuantities: z.array(ticketQuantitySchema),
    })
    .refine(
      data => {
        const totalQuantity = data.ticketQuantities.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        )
        return totalQuantity > 0
      },
      {
        message: 'Pilih minimal 1 tiket untuk melanjutkan',
        path: ['ticketQuantities'],
      },
    )
    .refine(
      data => {
        const totalQuantity = data.ticketQuantities.reduce(
          (sum, ticket) => sum + ticket.quantity,
          0,
        )
        return totalQuantity <= 5
      },
      {
        message: 'Maksimum jumlah tiket yang dapat dibeli adalah 5',
        path: ['ticketQuantities'],
      },
    )

  type TicketSelectionFormValues = z.infer<typeof ticketSelectionSchema>

  const visitorInfoSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Nama pengunjung diperlukan').min(3, 'Nama minimal 3 karakter'),
    email: z.string().min(1, 'Email diperlukan').email('Format email tidak valid'),
    phone: z
      .string()
      .min(1, 'Nomor HP diperlukan')
      .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor HP tidak valid (contoh: 08123456789)'),
    type: z.enum(['Dewasa', 'Anak-Anak']),
  })

  const orderInfoSchema = z
    .object({
      userEmail: z.string().email('Format email tidak valid'),
      userName: z.string().min(1, 'Nama pengguna diperlukan'),
      setAsFirstVisitor: z.boolean(),
      visitors: z.array(visitorInfoSchema).min(1, 'Minimal 1 pengunjung harus diisi'),
    })
    .refine(data => data.visitors.every(v => v.name.trim().length >= 3), {
      message: 'Semua pengunjung harus memiliki nama yang valid',
      path: ['visitors'],
    })

  type OrderInfoFormValues = z.infer<typeof orderInfoSchema>

  const paymentSchema = z.object({
    agreedToTerms: z.boolean().refine(val => val === true, {
      message: 'Anda harus menyetujui syarat dan ketentuan',
    }),
    promoCode: z.string().optional(),
  })

  type PaymentFormValues = z.infer<typeof paymentSchema>

  // ============================================================================
  // Page Setup
  // ============================================================================

  definePage({
    meta: {
      title: 'Detail Tiket',
    },
  })

  const route = useRoute()
  const router = useRouter()

  // Event ID dari route params
  const eventId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })

  // Mock data (TODO: Replace with API integration)
  const eventData = ref(getMockEventData(eventId.value))
  const userData = ref(getMockUserData())
  const pricing = getMockPricing()

  // Available tickets for form management
  // TODO: Replace with actual API call
  const availableTickets = [
    {
      ticketId: 1,
      ticketName: 'Adult',
      price: pricing.adultPrice,
      remainingQuota: 100,
    },
    {
      ticketId: 2,
      ticketName: 'Child',
      price: pricing.childPrice,
      remainingQuota: 100,
    },
  ]

  // Multi-step form state
  const currentStep = ref<BookingStep>(BOOKING_STEPS.TICKET_SELECTION)

  // Step 1: Ticket Selection Form

  const ticketSelectionForm = useForm<TicketSelectionFormValues>({
    validationSchema: toTypedSchema(ticketSelectionSchema),
    initialValues: {
      selectedTicketCategoryId: 0,
      visitDate: '',
      ticketQuantities: [],
    },
    validateOnMount: false,
  })

  // v-model bindings
  const ticketCategoryId = computed({
    get: () => ticketSelectionForm.values.selectedTicketCategoryId,
    set: (value: number) => ticketSelectionForm.setFieldValue('selectedTicketCategoryId', value),
  })

  const visitDate = computed({
    get: () => ticketSelectionForm.values.visitDate,
    set: (value: string) => ticketSelectionForm.setFieldValue('visitDate', value),
  })

  const isFirstVisitor = computed({
    get: () => orderInfoForm.values.setAsFirstVisitor,
    set: value => orderInfoForm.setFieldValue('setAsFirstVisitor', value),
  })

  const termsAgreed = computed({
    get: () => paymentForm.values.agreedToTerms,
    set: value => paymentForm.setFieldValue('agreedToTerms', value),
  })

  function updateTicketQuantity(ticketId: number, quantity: number) {
    const quantities = [...ticketSelectionForm.values.ticketQuantities]
    const index = quantities.findIndex(t => t.ticketId === ticketId)

    if (index >= 0) {
      quantities[index] = { ...quantities[index], quantity }
    } else {
      const ticketData = availableTickets.find(t => t.ticketId === ticketId)
      if (ticketData) {
        quantities.push({
          ticketId,
          ticketName: ticketData.ticketName,
          quantity,
          finalPrice: ticketData.price,
          remainingQuota: ticketData.remainingQuota,
        })
      }
    }

    ticketSelectionForm.setFieldValue('ticketQuantities', quantities)

    // Update visitors list based on new total quantity
    const totalQuantity = quantities.reduce((sum, ticket) => sum + ticket.quantity, 0)
    updateVisitorsList(totalQuantity)
  }

  // Step 2: Order Info Form

  const orderInfoForm = useForm<OrderInfoFormValues>({
    validationSchema: toTypedSchema(orderInfoSchema),
    initialValues: {
      userEmail: userData.value.email,
      userName: userData.value.name,
      setAsFirstVisitor: false,
      visitors: [],
    },
    validateOnMount: false,
  })

  // Helper: Update visitors list based on total quantity
  function updateVisitorsList(totalQuantity: number) {
    const currentVisitors = orderInfoForm.values.visitors

    if (totalQuantity === 0) {
      orderInfoForm.setFieldValue('visitors', [])
      return
    }

    if (totalQuantity === currentVisitors.length) {
      return // No change needed
    }

    const newVisitors = []
    for (let i = 0; i < totalQuantity; i++) {
      // Preserve existing visitor data if available, otherwise create empty visitor
      newVisitors.push(
        currentVisitors[i] || {
          id: String(i + 1),
          name: '',
          email: '',
          phone: '',
          type: 'Dewasa' as const,
        },
      )
    }

    orderInfoForm.setFieldValue('visitors', newVisitors)
  }

  // Computed: Get visitors from form values (single source of truth)
  const formVisitors = computed(() => orderInfoForm.values.visitors)

  // Handler for visitor updates from Step2Section
  function handleVisitorsUpdate(updatedVisitors: VisitorInfo[]) {
    orderInfoForm.setFieldValue('visitors', updatedVisitors)
  }

  // Step 3: Payment Form

  const paymentForm = useForm<PaymentFormValues>({
    validationSchema: toTypedSchema(paymentSchema),
    initialValues: {
      agreedToTerms: false,
      promoCode: '',
    },
    validateOnMount: false,
  })

  // Computed values
  const selectedQuantities = computed(() => {
    return ticketSelectionForm.values.ticketQuantities.map(ticket => ({
      ticketId: ticket.ticketId,
      quantity: ticket.quantity,
    }))
  })

  const ticketPrice = computed(() => {
    return ticketSelectionForm.values.ticketQuantities.reduce((sum, ticket) => {
      return sum + ticket.quantity * ticket.finalPrice
    }, 0)
  })

  // TODO: Get admin fee from API
  const ADMIN_FEE = 2500

  const totalPrice = computed(() => {
    return ticketPrice.value + ADMIN_FEE
  })

  const formattedTotalPrice = computed(() => {
    return formatCurrency(totalPrice.value)
  })

  const orderSummaryDetails = computed(() => {
    const parts: string[] = []

    ticketSelectionForm.values.ticketQuantities.forEach(ticket => {
      if (ticket.quantity > 0) {
        parts.push(`${ticket.quantity} ${ticket.ticketName}`)
      }
    })

    return parts.join(' • ')
  })

  const paymentBreakdown = computed<PaymentBreakdown>(() => ({
    ticketPrice: ticketPrice.value,
    adminFee: ADMIN_FEE,
    total: totalPrice.value,
  }))

  const headerTitle = computed(() => {
    return STEP_TITLES[currentStep.value as keyof typeof STEP_TITLES] || STEP_TITLES[1]
  })

  const footerButtonText = computed(() => {
    return currentStep.value === TOTAL_STEPS ? STEP_BUTTON_LABELS.PAY : STEP_BUTTON_LABELS.NEXT
  })

  // Form validation
  const isCurrentStepValid = computed(() => {
    switch (currentStep.value) {
      case BOOKING_STEPS.TICKET_SELECTION:
        return ticketSelectionForm.meta.value.valid
      case BOOKING_STEPS.ORDER_INFO:
        return orderInfoForm.meta.value.valid
      case BOOKING_STEPS.PAYMENT:
        return paymentForm.meta.value.valid
      default:
        return false
    }
  })

  const isNextButtonDisabled = computed(() => {
    return !isCurrentStepValid.value
  })

  // Event handlers

  function handleBack() {
    if (currentStep.value > 1) {
      currentStep.value--
    } else {
      router.back()
    }
  }

  function handleEditVisitor(visitorId: string) {
    // TODO: Implement edit visitor modal
    const visitor = formVisitors.value.find(v => v.id === visitorId)
    if (visitor) {
      // Modal implementation pending
    }
  }

  function handlePromoCode() {
    // TODO: Implement promo code modal
  }

  async function handleContinue() {
    if (isNextButtonDisabled.value) {
      return
    }

    let isValid = false

    switch (currentStep.value) {
      case BOOKING_STEPS.TICKET_SELECTION:
        isValid = await ticketSelectionForm.validate().then(result => result.valid)
        break
      case BOOKING_STEPS.ORDER_INFO:
        isValid = await orderInfoForm.validate().then(result => result.valid)
        break
      case BOOKING_STEPS.PAYMENT:
        isValid = await paymentForm.validate().then(result => result.valid)
        break
    }

    if (!isValid) {
      return
    }

    if (currentStep.value < TOTAL_STEPS) {
      currentStep.value++
    } else {
      processPayment()
    }
  }

  async function processPayment() {
    const [step1Valid, step2Valid, step3Valid] = await Promise.all([
      ticketSelectionForm.validate().then(result => result.valid),
      orderInfoForm.validate().then(result => result.valid),
      paymentForm.validate().then(result => result.valid),
    ])

    if (!step1Valid || !step2Valid || !step3Valid) {
      // eslint-disable-next-line no-console
      console.error('Form validation failed')
      return
    }

    // Get buyer info from session storage
    const sessionUser = authStorage.getUser<{
      fullname: string
      email: string
      phoneNumber?: string
    }>()

    // Transform form values to API request format (aligned with LifestyleCreateBookingRequest)
    let visitorOffset = 0
    const visitDateISO = ticketSelectionForm.values.visitDate

    const bookingData: LifestyleCreateBookingRequest = {
      programId: eventData.value.id,
      programCategoryId: ticketSelectionForm.values.selectedTicketCategoryId,
      isBookOrSelf: orderInfoForm.values.setAsFirstVisitor,
      isAgreeWithPolicy: paymentForm.values.agreedToTerms,
      startVisitDate: visitDateISO || null,
      startVisitTime: null, // TODO: Get from API ticket data
      endVisitDate: visitDateISO || null,
      endVisitTime: null, // TODO: Get from API ticket data
      listTicket: ticketSelectionForm.values.ticketQuantities
        .filter(ticket => ticket.quantity > 0)
        .map(ticket => {
          const ticketVisitors = orderInfoForm.values.visitors
            .slice(visitorOffset, visitorOffset + ticket.quantity)
            .map(visitor => ({
              name: visitor.name,
            }))

          visitorOffset += ticket.quantity

          return {
            ticketId: ticket.ticketId,
            ticketName: ticket.ticketName,
            ticketAmount: ticket.quantity,
            orderInformationForm: ticketVisitors,
          }
        }),
      buyerInfo: {
        fullName: sessionUser?.fullname || '',
        email: sessionUser?.email || '',
        phoneNumber: sessionUser?.phoneNumber || '',
      },
    }

    // TODO: Call booking API with bookingData

    // eslint-disable-next-line no-console
    console.log('Process payment with validated data:', bookingData)
  }
</script>

<template>
  <!-- Header -->
  <Header :title="headerTitle" positioning="sticky" @back="handleBack" />

  <!-- Progress Section -->
  <div class="sticky top-12 z-30 flex flex-col gap-2 bg-white px-4 pt-3 pb-3">
    <p class="body-caption text-slate-600">Tahap {{ currentStep }} dari {{ TOTAL_STEPS }}</p>
    <Progress :model-value="(currentStep / TOTAL_STEPS) * 100" class="h-1" />
  </div>

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-4 pb-28">
    <!-- Order Summary (Step 2 & 3) -->
    <div v-if="currentStep > BOOKING_STEPS.TICKET_SELECTION" class="px-4">
      <OrderSummaryCard
        :image-src="eventData.imageSrc"
        :date="eventData.date"
        :title="eventData.title"
        :details="orderSummaryDetails"
      />
    </div>

    <!-- Divider (Step 2 & 3) -->
    <Divider v-if="currentStep > BOOKING_STEPS.TICKET_SELECTION" thick />

    <!-- Step 1: Ticket Selection -->
    <LifestyleBookingStep1Section
      v-if="currentStep === BOOKING_STEPS.TICKET_SELECTION"
      :program-id="eventId"
      :event-title="eventData.title"
      :selected-ticket-type-id="String(ticketCategoryId)"
      :selected-date="visitDate"
      :selected-quantities="selectedQuantities"
      @ticket-type-selected="id => (ticketCategoryId = Number(id))"
      @date-selected="date => (visitDate = date)"
      @ticket-quantity-changed="updateTicketQuantity"
    />

    <!-- Step 2: Order Info -->
    <LifestyleBookingStep2Section
      v-if="currentStep === BOOKING_STEPS.ORDER_INFO"
      :is-first-visitor="isFirstVisitor"
      :visitors="formVisitors"
      @update:is-first-visitor="isFirstVisitor = $event"
      @update:visitors="handleVisitorsUpdate"
      @visitor-edit="handleEditVisitor"
    />

    <!-- Step 3: Payment -->
    <LifestyleBookingStep3Section
      v-if="currentStep === BOOKING_STEPS.PAYMENT"
      :visitors="formVisitors"
      :payment-breakdown="paymentBreakdown"
      :terms-agreed="termsAgreed"
      @update:terms-agreed="termsAgreed = $event"
      @apply-promo="handlePromoCode"
    />
  </main>

  <!-- Footer -->
  <Footer position="fixed">
    <div class="flex w-full items-center gap-3">
      <!-- Price Section -->
      <div class="flex flex-1 flex-col items-start gap-0">
        <Button variant="tertiary" size="xs" class="h-auto w-full justify-between p-0">
          <span class="body-l-semibold text-primary-600">{{ formattedTotalPrice }}</span>
          <ChevronDown class="size-4 text-slate-950" />
        </Button>
        <span class="body-caption text-slate-950">Belum termasuk pajak</span>
      </div>

      <!-- Action Button -->
      <Button
        variant="primary"
        size="sm"
        class="flex-1"
        :disabled="isNextButtonDisabled"
        @click="handleContinue"
      >
        {{ footerButtonText }}
      </Button>
    </div>
  </Footer>
</template>
