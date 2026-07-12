<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { useQueryClient } from '@tanstack/vue-query'
  import { useToast } from '@/composables/ui/useToast'
  import { AppCopyrightFooter } from '@/components/shared'
  import {
    invitationKeys,
    useInvitationCategoryInfo,
    useInvitationProgramInfo,
    useRegisterInvitation,
  } from '@/composables/services'
  import {
    VOUCHER_PROGRAM,
    SECURITY_ASSURANCES,
    useVoucherRequest,
    VoucherRequestBrandPanel,
    VoucherRequestHeader,
    PersonalInfoSection,
    CompanyInfoSection,
    SecurityAssuranceBar,
    VoucherRequestCard,
    VoucherRequestSuccessDialog,
    DataSecurityBadge,
  } from '@/features/voucher-request'

  definePage({
    name: 'PublicVoucherRequest',
    meta: { title: 'Pengajuan Voucher — PLN Electric Run 2026' },
  })

  const toast = useToast()
  const route = useRoute('PublicVoucherRequest')
  const queryClient = useQueryClient()

  const programId = computed(() => {
    const raw = route.query.programId
    if (typeof raw !== 'string') return undefined
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : undefined
  })
  const hasValidParams = computed(() => !!programId.value)

  onMounted(() => {
    if (!hasValidParams.value) {
      toast.error({
        title: 'Link tidak valid',
        description: 'Parameter programId pada URL tidak valid.',
      })
    }
  })

  const schema = toTypedSchema(
    z.object({
      fullName: z.string().min(1, 'Nama wajib diisi').min(2, 'Nama terlalu pendek'),
      phone: z
        .string()
        .min(1, 'Nomor HP wajib diisi')
        .regex(/^[0-9+\-\s]{8,20}$/, 'Format nomor HP tidak valid'),
      email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
      companyName: z.string().min(1, 'Nama perusahaan wajib diisi'),
      ticketCategory: z.string().min(1, 'Kategori wajib dipilih'),
    }),
  )

  const {
    handleSubmit,
    isSubmitting,
    resetForm,
    values: formValues,
    setFieldValue,
  } = useForm({
    validationSchema: schema,
    initialValues: {
      fullName: '',
      phone: '',
      email: '',
      companyName: '',
      ticketCategory: '',
    },
  })

  const programInfo = useInvitationProgramInfo({
    params: { programId },
  })

  const programName = computed(
    () => programInfo.data.value?.data?.ProgramName ?? VOUCHER_PROGRAM.name,
  )

  const ticketCategoryOptions = computed(() =>
    (programInfo.data.value?.data?.Categories ?? []).map(c => ({
      value: String(c.CategoryID),
      label: c.CategoryName,
    })),
  )

  // Auto-select first category so category-info fetches without user input.
  watch(
    ticketCategoryOptions,
    options => {
      if (!formValues.ticketCategory && options.length > 0) {
        setFieldValue('ticketCategory', options[0].value)
      }
    },
    { immediate: true },
  )

  const selectedCategoryId = computed(() => {
    const raw = formValues.ticketCategory
    const parsed = raw ? Number(raw) : NaN
    return Number.isFinite(parsed) ? parsed : undefined
  })

  const categoryInfo = useInvitationCategoryInfo({
    params: { programId, categoryId: selectedCategoryId },
    // Poll every 5s so ticket quota reflects near-live availability.
    options: { refetchInterval: 5000, staleTime: 0 },
  })

  const voucherCategories = computed(() =>
    (categoryInfo.data.value?.data?.Tickets ?? []).map(t => ({
      id: String(t.TicketID),
      label: t.TicketName,
      quota: t.Quota,
    })),
  )

  const vouchers = useVoucherRequest(voucherCategories)

  // null = dialog closed. String = dialog open, holds the invitation code.
  const successCode = ref<string | null>(null)

  const register = useRegisterInvitation()
  const submitting = computed(() => register.isPending.value)

  const onSubmit = handleSubmit(values => {
    if (!programId.value || !selectedCategoryId.value) return

    if (!vouchers.hasSelection.value) {
      toast.error({
        title: 'Pilih voucher',
        description: 'Silakan pilih minimal satu jenis voucher sebelum mengajukan.',
      })
      return
    }

    const tickets = vouchers.categories.value
      .map(c => ({ ticketId: Number(c.id), quota: vouchers.quantities[c.id] ?? 0 }))
      .filter(t => t.quota > 0)

    if (tickets.length === 0) {
      toast.error({
        title: 'Data tiket belum siap',
        description: 'Informasi tiket sedang dimuat. Silakan coba lagi sebentar.',
      })
      return
    }

    // Errors surface via the global HTTP interceptor toast — no local onError needed.
    register.mutate(
      {
        programSlug: VOUCHER_PROGRAM.apiSlug,
        body: {
          name: values.fullName,
          phone: values.phone,
          email: values.email,
          entity: values.companyName,
          programId: programId.value,
          categoryId: selectedCategoryId.value,
          tickets,
        },
      },
      {
        onSuccess: res => {
          successCode.value = res.data?.Code ?? ''
          // Keep the selected category so the user doesn't see it flash empty
          // between reset and the watcher re-selecting first.
          resetForm({ values: { ticketCategory: formValues.ticketCategory } })
          vouchers.reset()
          // Reflect updated quotas after the registration lands.
          queryClient.invalidateQueries({
            queryKey: invitationKeys.categoryInfo(programId.value, selectedCategoryId.value),
          })
        },
      },
    )
  })
</script>

<template>
  <div class="from-primary-50/40 to-background flex min-h-screen bg-linear-to-b">
    <VoucherRequestBrandPanel :tagline="VOUCHER_PROGRAM.tagline" />

    <!-- `lg:ml-64` reserves space for the fixed sidebar. -->
    <main class="relative flex min-w-0 flex-1 flex-col lg:ml-64">
      <div class="flex items-center justify-end px-4 pt-5 sm:px-10 sm:pt-8 lg:px-12">
        <DataSecurityBadge />
      </div>

      <!-- Header in left column so the sticky summary top-aligns with the title. -->
      <form
        class="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-start gap-8 px-4 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12 lg:px-12 lg:py-14"
        @submit.prevent="onSubmit"
      >
        <div class="flex min-w-0 flex-col gap-10">
          <VoucherRequestHeader
            title="Pengajuan Voucher"
            :subtitle="`Silakan lengkapi data berikut untuk melakukan request voucher ${programName}.`"
          />

          <div class="flex flex-col gap-10">
            <PersonalInfoSection :disabled="submitting || !hasValidParams" />
            <CompanyInfoSection :disabled="submitting || !hasValidParams" />
          </div>

          <SecurityAssuranceBar :items="SECURITY_ASSURANCES" class="hidden lg:flex" />
        </div>

        <div class="lg:sticky lg:top-14 lg:self-start">
          <VoucherRequestCard
            :program-name="programName"
            :ticket-category-options="ticketCategoryOptions"
            :categories="vouchers.categories.value"
            :quantities="vouchers.quantities"
            :total="vouchers.totalVouchers.value"
            :submitting="submitting || isSubmitting"
            :disabled="!hasValidParams"
            @update:quantity="vouchers.setQuantity"
            @submit="onSubmit"
          />
        </div>

        <SecurityAssuranceBar :items="SECURITY_ASSURANCES" class="lg:hidden" />
      </form>

      <AppCopyrightFooter class="px-4 pb-6 sm:px-10 lg:px-12" />
    </main>

    <VoucherRequestSuccessDialog
      :open="successCode !== null"
      :request-id="successCode ?? ''"
      @update:open="v => !v && (successCode = null)"
      @acknowledge="successCode = null"
    />
  </div>
</template>
