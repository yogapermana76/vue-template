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
  import type { TicketData } from '@/components/lifestyle/sections/booking'
  import type { PaymentBreakdown, VisitorInfo } from '@/components/lifestyle/sections/order'
  import { useSwiperStyles } from '@/composables/ui/useSwiperStyles'
  import { getMockEventData } from '@/mocks/lifestyle/ticket-data'
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

  const FORM_FIELD_PATHS = {
    TICKET_CATEGORY_ID: 'selectedTicketCategoryId',
    VISIT_DATE: 'visitDate',
    TICKET_QUANTITIES: 'ticketQuantities',
    SET_AS_FIRST_VISITOR: 'setAsFirstVisitor',
    VISITORS: 'visitors',
    AGREED_TO_TERMS: 'agreedToTerms',
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
        return totalQuantity > 0 && totalQuantity <= 5
      },
      {
        message: 'Pilih 1-5 tiket untuk melanjutkan',
        path: ['ticketQuantities'],
      },
    )

  type TicketSelectionFormValues = z.infer<typeof ticketSelectionSchema>

  const visitorInfoSchema = z
    .object({
      id: z.string(),
      type: z.string(),
    })
    .catchall(z.string().optional()) // Allow dynamic fields from API dengan tipe string | undefined

  const orderInfoSchema = z.object({
    userEmail: z.string().email('Format email tidak valid'),
    userName: z.string().min(1, 'Nama pengguna diperlukan'),
    setAsFirstVisitor: z.boolean(),
    visitors: z.array(visitorInfoSchema).min(1, 'Minimal 1 pengunjung harus diisi'),
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

  /**
   * Get buyer info from session storage
   */
  const buyerInfo = computed(() => {
    const sessionUser = authStorage.getUser<{
      fullname: string
      email: string
      phoneNumber?: string
    }>()

    return {
      fullName: sessionUser?.fullname || '',
      email: sessionUser?.email || '',
      phoneNumber: sessionUser?.phoneNumber || '',
    }
  })

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
    set: (value: number) =>
      ticketSelectionForm.setFieldValue(FORM_FIELD_PATHS.TICKET_CATEGORY_ID, value),
  })

  const visitDate = computed({
    get: () => ticketSelectionForm.values.visitDate,
    set: (value: string) => ticketSelectionForm.setFieldValue(FORM_FIELD_PATHS.VISIT_DATE, value),
  })

  const isFirstVisitor = computed({
    get: () => orderInfoForm.values.setAsFirstVisitor,
    set: value => orderInfoForm.setFieldValue(FORM_FIELD_PATHS.SET_AS_FIRST_VISITOR, value),
  })

  const termsAgreed = computed({
    get: () => paymentForm.values.agreedToTerms,
    set: value => paymentForm.setFieldValue(FORM_FIELD_PATHS.AGREED_TO_TERMS, value),
  })

  /**
   * Calculate total ticket quantity
   */
  function getTotalTicketQuantity(quantities: TicketSelectionFormValues['ticketQuantities']) {
    return quantities.reduce((sum, ticket) => sum + ticket.quantity, 0)
  }

  /**
   * Find or create ticket quantity entry
   */
  function getUpdatedTicketQuantities(
    ticketId: number,
    quantity: number,
    ticketData: TicketData,
    currentQuantities: TicketSelectionFormValues['ticketQuantities'],
  ) {
    const quantities = [...currentQuantities]
    const existingIndex = quantities.findIndex(t => t.ticketId === ticketId)

    if (existingIndex >= 0) {
      // Update existing ticket quantity
      quantities[existingIndex] = { ...quantities[existingIndex], quantity }
    } else {
      // Add new ticket entry
      quantities.push({
        ticketId,
        ticketName: ticketData.ticketName,
        quantity,
        finalPrice: ticketData.price,
        remainingQuota: ticketData.remainingQuota,
      })
    }

    return quantities
  }

  /**
   * Update ticket quantity and sync visitor list
   */
  function updateTicketQuantity(ticketId: number, quantity: number, ticketData: TicketData) {
    const updatedQuantities = getUpdatedTicketQuantities(
      ticketId,
      quantity,
      ticketData,
      ticketSelectionForm.values.ticketQuantities,
    )

    ticketSelectionForm.setFieldValue(FORM_FIELD_PATHS.TICKET_QUANTITIES, updatedQuantities)

    // Sync visitors list with total ticket quantity
    const totalQuantity = getTotalTicketQuantity(updatedQuantities)
    updateVisitorsList(totalQuantity)
  }

  // Step 2: Order Info Form

  const orderInfoForm = useForm<OrderInfoFormValues>({
    validationSchema: toTypedSchema(orderInfoSchema),
    initialValues: {
      userEmail: buyerInfo.value.email,
      userName: buyerInfo.value.fullName,
      setAsFirstVisitor: false,
      visitors: [],
    },
    validateOnMount: false,
  })

  /**
   * Create default visitor entry
   */
  function createDefaultVisitor(index: number): VisitorInfo {
    return {
      id: String(index + 1),
      type: '',
      name: '',
      email: '',
      phone: '',
    }
  }

  /**
   * Generate visitors list based on total quantity
   * Preserves existing visitor data when possible
   */
  function generateVisitorsList(
    totalQuantity: number,
    currentVisitors: VisitorInfo[],
  ): VisitorInfo[] {
    if (totalQuantity === 0) {
      return []
    }

    return Array.from({ length: totalQuantity }, (_, index) => {
      // Preserve existing visitor completely (including their type selection)
      return currentVisitors[index] || createDefaultVisitor(index)
    })
  }

  /**
   * Update visitors list based on total ticket quantity
   * Only updates if quantity has changed
   */
  function updateVisitorsList(totalQuantity: number) {
    const currentVisitors = orderInfoForm.values.visitors

    // Skip update if quantity hasn't changed
    if (totalQuantity === currentVisitors.length) {
      return
    }

    const newVisitors = generateVisitorsList(totalQuantity, currentVisitors)
    orderInfoForm.setFieldValue(FORM_FIELD_PATHS.VISITORS, newVisitors)
  }

  // Computed: Get visitors from form values (single source of truth)
  const formVisitors = computed(() => orderInfoForm.values.visitors as VisitorInfo[])

  // Handler for visitor updates from Step2Section
  function handleVisitorsUpdate(updatedVisitors: VisitorInfo[]) {
    orderInfoForm.setFieldValue(FORM_FIELD_PATHS.VISITORS, updatedVisitors)
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

  // ============================================================================
  // Computed Values & Helpers
  // ============================================================================

  // TODO: Get admin fee from API
  const ADMIN_FEE = 2500

  /**
   * Get selected ticket quantities in simplified format
   */
  const selectedQuantities = computed(() => {
    return ticketSelectionForm.values.ticketQuantities.map(ticket => ({
      ticketId: ticket.ticketId,
      quantity: ticket.quantity,
    }))
  })

  /**
   * Calculate total ticket price
   */
  const ticketPrice = computed(() => {
    return ticketSelectionForm.values.ticketQuantities.reduce(
      (sum, ticket) => sum + ticket.quantity * ticket.finalPrice,
      0,
    )
  })

  /**
   * Calculate total price including admin fee
   */
  const totalPrice = computed(() => ticketPrice.value + ADMIN_FEE)

  /**
   * Format total price as currency string
   */
  const formattedTotalPrice = computed(() => formatCurrency(totalPrice.value))

  /**
   * Generate order summary details string (e.g., "2 Adult • 1 Child")
   */
  const orderSummaryDetails = computed(() => {
    return ticketSelectionForm.values.ticketQuantities
      .filter(ticket => ticket.quantity > 0)
      .map(ticket => `${ticket.quantity} ${ticket.ticketName}`)
      .join(' • ')
  })

  /**
   * Get payment breakdown for display
   */
  const paymentBreakdown = computed<PaymentBreakdown>(() => ({
    ticketPrice: ticketPrice.value,
    adminFee: ADMIN_FEE,
    total: totalPrice.value,
  }))

  const headerTitle = computed(() => {
    return STEP_TITLES[currentStep.value as keyof typeof STEP_TITLES] || STEP_TITLES[1]
  })

  const footerButtonText = computed(() => {
    return currentStep.value === TOTAL_STEPS ? 'Bayar' : 'Selanjutnya'
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

  // ============================================================================
  // Step Navigation
  // ============================================================================

  /**
   * Get form instance for current step
   */
  function getCurrentStepForm() {
    switch (currentStep.value) {
      case BOOKING_STEPS.TICKET_SELECTION:
        return ticketSelectionForm
      case BOOKING_STEPS.ORDER_INFO:
        return orderInfoForm
      case BOOKING_STEPS.PAYMENT:
        return paymentForm
      default:
        return null
    }
  }

  /**
   * Validate current step form
   */
  async function validateCurrentStep(): Promise<boolean> {
    const form = getCurrentStepForm()
    if (!form) return false

    const result = await form.validate()
    return result.valid
  }

  /**
   * Navigate to previous step or back to previous page
   */
  function handleBack() {
    if (currentStep.value > 1) {
      currentStep.value--
    } else {
      router.back()
    }
  }

  /**
   * Continue to next step or process payment
   */
  async function handleContinue() {
    if (isNextButtonDisabled.value) {
      return
    }

    const isValid = await validateCurrentStep()
    if (!isValid) {
      return
    }

    if (currentStep.value < TOTAL_STEPS) {
      currentStep.value++
    } else {
      await processPayment()
    }
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

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

  // ============================================================================
  // Data Transformation Helpers
  // ============================================================================

  /**
   * Distribute visitors to tickets based on quantity
   */
  function distributeVisitorsToTickets(
    tickets: TicketSelectionFormValues['ticketQuantities'],
    visitors: VisitorInfo[],
  ) {
    const result = tickets
      .filter(ticket => ticket.quantity > 0)
      .reduce<{
        tickets: LifestyleCreateBookingRequest['listTicket']
        offset: number
      }>(
        (acc, ticket) => {
          const ticketVisitors = visitors
            .slice(acc.offset, acc.offset + ticket.quantity)
            .map(visitor => {
              // Exclude internal fields (id, type)
              const { id, type, ...formData } = visitor
              return formData
            })

          acc.tickets.push({
            ticketId: ticket.ticketId,
            ticketAmount: ticket.quantity,
            orderInformationForm: ticketVisitors,
          })

          acc.offset += ticket.quantity
          return acc
        },
        { tickets: [], offset: 0 },
      )

    return result.tickets
  }

  /**
   * Build booking data from all form values
   * Single source of truth for API request construction
   */
  function buildBookingData(): LifestyleCreateBookingRequest {
    const visitDateISO = ticketSelectionForm.values.visitDate

    return {
      programId: eventData.value.id,
      programCategoryId: ticketSelectionForm.values.selectedTicketCategoryId,
      isBookOrSelf: orderInfoForm.values.setAsFirstVisitor,
      isAgreeWithPolicy: paymentForm.values.agreedToTerms,
      startVisitDate: visitDateISO || null,
      startVisitTime: null, // TODO: Get from API ticket data
      endVisitDate: visitDateISO || null,
      endVisitTime: null, // TODO: Get from API ticket data
      listTicket: distributeVisitorsToTickets(
        ticketSelectionForm.values.ticketQuantities,
        orderInfoForm.values.visitors,
      ),
      buyerInfo: buyerInfo.value,
    }
  }

  /**
   * Validate all form steps
   * Returns tuple of validation results
   */
  async function validateAllSteps() {
    return Promise.all([
      ticketSelectionForm.validate().then(result => result.valid),
      orderInfoForm.validate().then(result => result.valid),
      paymentForm.validate().then(result => result.valid),
    ])
  }

  // ============================================================================
  // Payment Processing
  // ============================================================================

  async function processPayment() {
    const [step1Valid, step2Valid, step3Valid] = await validateAllSteps()

    if (!step1Valid || !step2Valid || !step3Valid) {
      // eslint-disable-next-line no-console
      console.error('Form validation failed')
      return
    }

    const bookingData = buildBookingData()

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
      :buyer-info="buyerInfo"
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
