<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
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
  import { useVoucherSelection, useBooking } from '@/composables/lifestyle'
  import { getMockEventData, getMockProgramTicketCategories } from '@/mocks/lifestyle/ticket-data'
  import { formatCurrency } from '@/utils/currency'
  import { authStorage } from '@/utils/storage'
  import type { LifestyleCreateBookingRequest } from '@/types/services/lifestyle/booking.types'

  useSwiperStyles()

  // Constants
  // ---------

  const BOOKING_STEPS = {
    TICKET_SELECTION: 1,
    ORDER_INFO: 2,
    PAYMENT: 3,
  } as const

  type BookingStep = (typeof BOOKING_STEPS)[keyof typeof BOOKING_STEPS]

  const TOTAL_STEPS = 3
  const MIN_TICKET_QUANTITY = 1
  const MAX_TICKET_QUANTITY = 5
  const ADMIN_FEE = 2500 // TODO: Get from API

  const STEP_CONFIG = {
    [BOOKING_STEPS.TICKET_SELECTION]: {
      title: 'Detail Tiket',
      buttonText: 'Selanjutnya',
    },
    [BOOKING_STEPS.ORDER_INFO]: {
      title: 'Isi Data Diri',
      buttonText: 'Selanjutnya',
    },
    [BOOKING_STEPS.PAYMENT]: {
      title: 'Detail Tagihan',
      buttonText: 'Bayar',
    },
  } as const

  const FORM_FIELD_PATHS = {
    TICKET_CATEGORY_ID: 'selectedTicketCategoryId',
    VISIT_DATE: 'visitDate',
    TICKET_QUANTITIES: 'ticketQuantities',
    SET_AS_FIRST_VISITOR: 'setAsFirstVisitor',
    VISITORS: 'visitors',
    AGREED_TO_TERMS: 'agreedToTerms',
  } as const

  // Validation Schemas

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
        return totalQuantity >= MIN_TICKET_QUANTITY && totalQuantity <= MAX_TICKET_QUANTITY
      },
      {
        message: `Pilih ${MIN_TICKET_QUANTITY}-${MAX_TICKET_QUANTITY} tiket untuk melanjutkan`,
        path: ['ticketQuantities'],
      },
    )

  type TicketSelectionFormValues = z.infer<typeof ticketSelectionSchema>

  const visitorInfoSchema = z
    .object({
      id: z.string(),
      type: z.string(),
    })
    .catchall(z.string().optional())

  const orderInfoSchema = z
    .object({
      userEmail: z.string().email('Format email tidak valid'),
      userName: z.string().min(1, 'Nama pengguna diperlukan'),
      setAsFirstVisitor: z.boolean(),
      visitors: z.array(visitorInfoSchema).min(1, 'Minimal 1 pengunjung harus diisi'),
    })
    .refine(
      data =>
        data.visitors.every(({ id: _id, type: _type, ...fields }) => {
          const entries = Object.values(fields)
          return entries.length > 0 && entries.every(val => val && val.trim())
        }),
      {
        message: 'Semua data pengunjung harus diisi lengkap',
        path: ['visitors'],
      },
    )

  type OrderInfoFormValues = z.infer<typeof orderInfoSchema>

  const paymentSchema = z.object({
    agreedToTerms: z.boolean().refine(val => val === true, {
      message: 'Anda harus menyetujui syarat dan ketentuan',
    }),
    promoCode: z.string().optional(),
  })

  type PaymentFormValues = z.infer<typeof paymentSchema>

  // Page Setup

  definePage({
    meta: {
      title: 'Detail Tiket',
    },
  })

  const route = useRoute()
  const router = useRouter()

  // Voucher selection composable
  const { selectedVoucher, openVoucherSelection, clearVoucher } = useVoucherSelection()

  // Event ID dari route params
  const eventId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })

  // Mock data (TODO: Replace with API integration)
  const eventData = ref(getMockEventData(eventId.value))
  const ticketCategories = getMockProgramTicketCategories()

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

  // State Management

  const currentStep = ref<BookingStep>(BOOKING_STEPS.TICKET_SELECTION)

  // Form Instances

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

  // Step 3: Payment Form
  const paymentForm = useForm<PaymentFormValues>({
    validationSchema: toTypedSchema(paymentSchema),
    initialValues: {
      agreedToTerms: false,
      promoCode: '',
    },
    validateOnMount: false,
  })

  // Form Field Bindings (v-model)

  // Step 1 bindings
  const ticketCategoryId = computed({
    get: () => ticketSelectionForm.values.selectedTicketCategoryId,
    set: (value: number) =>
      ticketSelectionForm.setFieldValue(FORM_FIELD_PATHS.TICKET_CATEGORY_ID, value),
  })

  const visitDate = computed({
    get: () => ticketSelectionForm.values.visitDate,
    set: (value: string) => ticketSelectionForm.setFieldValue(FORM_FIELD_PATHS.VISIT_DATE, value),
  })

  // Get selected ticket category name
  const selectedTicketCategoryName = computed(() => {
    const categoryId = ticketSelectionForm.values.selectedTicketCategoryId
    const category = ticketCategories.find(cat => cat.id === String(categoryId))
    return category?.title || ''
  })

  // Step 2 bindings
  const isFirstVisitor = computed({
    get: () => orderInfoForm.values.setAsFirstVisitor,
    set: value => orderInfoForm.setFieldValue(FORM_FIELD_PATHS.SET_AS_FIRST_VISITOR, value),
  })

  const formVisitors = computed(() => orderInfoForm.values.visitors as VisitorInfo[])

  // Step 3 bindings
  const termsAgreed = computed({
    get: () => paymentForm.values.agreedToTerms,
    set: value => paymentForm.setFieldValue(FORM_FIELD_PATHS.AGREED_TO_TERMS, value),
  })

  // Computed Properties

  // Step form mapping
  const stepFormMap = computed(() => ({
    [BOOKING_STEPS.TICKET_SELECTION]: ticketSelectionForm,
    [BOOKING_STEPS.ORDER_INFO]: orderInfoForm,
    [BOOKING_STEPS.PAYMENT]: paymentForm,
  }))

  // Booking state persistence
  const { restore, clear } = useBooking({
    eventId,
    currentStep,
    forms: {
      ticketSelection: ticketSelectionForm,
      orderInfo: orderInfoForm,
      payment: paymentForm,
    },
  })

  // Restore saved state on mount
  onMounted(restore)

  // Step configuration
  const currentStepConfig = computed(() => STEP_CONFIG[currentStep.value])
  const headerTitle = computed(() => currentStepConfig.value.title)
  const footerButtonText = computed(() => currentStepConfig.value.buttonText)

  // Ticket quantities
  const selectedQuantities = computed(() =>
    ticketSelectionForm.values.ticketQuantities.map(({ ticketId, quantity }) => ({
      ticketId,
      quantity,
    })),
  )

  // Price calculations
  const ticketPrice = computed(() =>
    ticketSelectionForm.values.ticketQuantities.reduce(
      (sum, ticket) => sum + ticket.quantity * ticket.finalPrice,
      0,
    ),
  )

  // Voucher discount calculation
  const voucherDiscount = computed(() => {
    if (!selectedVoucher.value) return 0

    if (selectedVoucher.value.discountAmount) {
      return selectedVoucher.value.discountAmount
    }

    if (selectedVoucher.value.discountPercentage) {
      return Math.floor(ticketPrice.value * (selectedVoucher.value.discountPercentage / 100))
    }

    return 0
  })

  const totalPrice = computed(() => {
    const subtotal = ticketPrice.value + ADMIN_FEE
    return Math.max(0, subtotal - voucherDiscount.value)
  })

  const displayPrice = computed(() => {
    if (currentStep.value === BOOKING_STEPS.PAYMENT) {
      return totalPrice.value
    }
    return ticketPrice.value
  })

  const formattedDisplayPrice = computed(() => formatCurrency(displayPrice.value))

  // Order summary
  const orderSummaryDetails = computed(() => {
    const tickets = ticketSelectionForm.values.ticketQuantities.filter(
      ticket => ticket.quantity > 0,
    )
    if (tickets.length === 0) return ''

    const ticketDetails = tickets
      .map(ticket => `${ticket.quantity} ${ticket.ticketName}`)
      .join(' • ')
    const categoryName = selectedTicketCategoryName.value

    return categoryName ? `${categoryName} • ${ticketDetails}` : ticketDetails
  })

  const paymentBreakdown = computed<PaymentBreakdown>(() => ({
    ticketPrice: ticketPrice.value,
    adminFee: ADMIN_FEE,
    discount: voucherDiscount.value,
    total: totalPrice.value,
  }))

  // Form validation
  const isCurrentStepValid = computed(() => {
    const form = stepFormMap.value[currentStep.value]
    return form?.meta.value.valid ?? false
  })

  const isNextButtonDisabled = computed(() => !isCurrentStepValid.value)

  // Watch for voucher selection changes and sync to payment form
  watch(selectedVoucher, newVoucher => {
    if (newVoucher) {
      paymentForm.setFieldValue('promoCode', newVoucher.code)
    } else {
      paymentForm.setFieldValue('promoCode', '')
    }
  })

  // Helper Functions

  const getTotalTicketQuantity = (quantities: TicketSelectionFormValues['ticketQuantities']) =>
    quantities.reduce((sum, ticket) => sum + ticket.quantity, 0)

  const createDefaultVisitor = (index: number, ticketType: string = ''): VisitorInfo => ({
    id: `visitor-${Date.now()}-${index}`,
    type: ticketType,
    name: '',
    email: '',
    phone: '',
  })

  const getCurrentStepForm = () => stepFormMap.value[currentStep.value] || null

  async function validateCurrentStep(): Promise<boolean> {
    const form = getCurrentStepForm()
    if (!form) return false

    const result = await form.validate()
    return result.valid
  }

  function updateTicketQuantity(ticketId: number, quantity: number, ticketData: TicketData) {
    const quantities = [...ticketSelectionForm.values.ticketQuantities]
    const existingIndex = quantities.findIndex(t => t.ticketId === ticketId)

    if (existingIndex >= 0) {
      quantities[existingIndex] = { ...quantities[existingIndex], quantity }
    } else {
      quantities.push({
        ticketId,
        ticketName: ticketData.ticketName,
        quantity,
        finalPrice: ticketData.price,
        remainingQuota: ticketData.remainingQuota,
      })
    }

    ticketSelectionForm.setFieldValue(FORM_FIELD_PATHS.TICKET_QUANTITIES, quantities)
    updateVisitorsList(getTotalTicketQuantity(quantities))
  }

  function updateVisitorsList(totalQuantity: number) {
    const currentVisitors = orderInfoForm.values.visitors

    if (totalQuantity === currentVisitors.length) return

    if (totalQuantity === 0) {
      orderInfoForm.setFieldValue(FORM_FIELD_PATHS.VISITORS, [])
      return
    }

    const visitorTypes = ticketSelectionForm.values.ticketQuantities.flatMap(ticket =>
      Array(ticket.quantity).fill(ticket.ticketName),
    )

    const newVisitors = Array.from({ length: totalQuantity }, (_, i) => {
      const existing = currentVisitors[i]
      const ticketType = visitorTypes[i] || ''

      return existing?.type === ticketType ? existing : createDefaultVisitor(i, ticketType)
    })

    orderInfoForm.setFieldValue(FORM_FIELD_PATHS.VISITORS, newVisitors)
  }

  /**
   * Handler for visitor updates from Step2Section
   */
  function handleVisitorsUpdate(updatedVisitors: VisitorInfo[]) {
    orderInfoForm.setFieldValue(FORM_FIELD_PATHS.VISITORS, updatedVisitors)
  }

  // Navigation Handlers

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
    if (isNextButtonDisabled.value) return

    const isValid = await validateCurrentStep()
    if (!isValid) return

    if (currentStep.value < TOTAL_STEPS) {
      currentStep.value++
    } else {
      await processPayment()
    }
  }

  // Event Handlers

  /**
   * Handle edit visitor modal
   * TODO: Implement edit visitor modal
   */
  const handleEditVisitor = (visitorId: string) => {
    const visitor = formVisitors.value.find(v => v.id === visitorId)
    if (visitor) {
      // Modal implementation pending
    }
  }

  /**
   * Handle promo code modal
   */
  const handlePromoCode = () => {
    openVoucherSelection()
  }

  // Data Transformation

  /**
   * Distribute visitors to tickets based on quantity
   */
  function distributeVisitorsToTickets(
    tickets: TicketSelectionFormValues['ticketQuantities'],
    visitors: VisitorInfo[],
  ): LifestyleCreateBookingRequest['listTicket'] {
    let offset = 0

    return tickets
      .filter(ticket => ticket.quantity > 0)
      .map(ticket => {
        const ticketVisitors = visitors
          .slice(offset, offset + ticket.quantity)
          .map(({ id: _id, type: _type, ...formData }) => formData)

        offset += ticket.quantity

        return {
          ticketId: ticket.ticketId,
          ticketAmount: ticket.quantity,
          orderInformationForm: ticketVisitors,
        }
      })
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
   */
  const validateAllSteps = async () => {
    const results = await Promise.all([
      ticketSelectionForm.validate(),
      orderInfoForm.validate(),
      paymentForm.validate(),
    ])

    return results.every(result => result.valid)
  }

  // Payment Processing

  /**
   * Process payment with validated booking data
   */
  async function processPayment() {
    const isValid = await validateAllSteps()

    if (!isValid) {
      // eslint-disable-next-line no-console
      console.error('Form validation failed')
      return
    }

    const bookingData = buildBookingData()

    // TODO: Call booking API with bookingData
    // eslint-disable-next-line no-console
    console.log('Process payment with validated data:', bookingData)

    // Clear saved state after successful payment
    clear()
    clearVoucher()
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
      :selected-ticket-category-id="String(ticketCategoryId)"
      :selected-date="visitDate"
      :selected-quantities="selectedQuantities"
      @ticket-category-selected="id => (ticketCategoryId = Number(id))"
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
      :selected-voucher="selectedVoucher"
      @update:terms-agreed="termsAgreed = $event"
      @apply-promo="handlePromoCode"
      @remove-voucher="clearVoucher"
    />
  </main>

  <!-- Footer -->
  <Footer position="fixed">
    <div class="flex w-full items-center gap-3">
      <!-- Price Section -->
      <div class="flex flex-1 flex-col items-start gap-0">
        <Button variant="tertiary" size="xs" class="h-auto w-full justify-between p-0">
          <span class="body-l-semibold text-primary-600">{{ formattedDisplayPrice }}</span>
          <ChevronDown class="size-4 text-slate-950" />
        </Button>
        <span class="body-caption text-slate-950">
          {{
            currentStep < BOOKING_STEPS.PAYMENT ? 'Total pembelian tiket' : 'Belum termasuk pajak'
          }}
        </span>
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
