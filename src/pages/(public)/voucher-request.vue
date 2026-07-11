<script setup lang="ts">
  import { ref } from 'vue'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { useToast } from '@/composables/ui/useToast'
  import { AppCopyrightFooter } from '@/components/shared'
  import {
    VOUCHER_PROGRAM,
    TICKET_CATEGORY_OPTIONS,
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

  const schema = toTypedSchema(
    z.object({
      fullName: z.string().min(1, 'Nama wajib diisi').min(2, 'Nama terlalu pendek'),
      phone: z
        .string()
        .min(1, 'Nomor HP wajib diisi')
        .regex(/^[0-9+\-\s]{8,20}$/, 'Format nomor HP tidak valid'),
      email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
      nik: z
        .string()
        .min(1, 'NIK wajib diisi')
        .regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
      companyName: z.string().min(1, 'Nama perusahaan wajib diisi'),
      ticketCategory: z.string().min(1, 'Kategori wajib dipilih'),
    }),
  )

  const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
      fullName: '',
      phone: '',
      email: '',
      nik: '',
      companyName: '',
      ticketCategory: '',
    },
  })

  const vouchers = useVoucherRequest()
  const submitting = ref(false)

  const successOpen = ref(false)
  const successRequestId = ref('')

  // Generate a short human-friendly request ID. Backend eventually authoritative.
  const generateRequestId = (): string => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let out = 'ER'
    for (let i = 0; i < 5; i++) {
      out += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return out
  }

  const onSubmit = handleSubmit(async () => {
    if (!vouchers.hasSelection.value) {
      toast.error({
        title: 'Pilih voucher',
        description: 'Silakan pilih minimal satu jenis voucher sebelum mengajukan.',
      })
      return
    }

    submitting.value = true
    try {
      // Backend hookup lands here — simulated round-trip so button + form states can be exercised.
      await new Promise(r => setTimeout(r, 800))

      successRequestId.value = generateRequestId()
      successOpen.value = true
    } catch {
      toast.error({
        title: 'Pengajuan gagal',
        description: 'Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.',
      })
    } finally {
      submitting.value = false
    }
  })

  const onSuccessAcknowledge = () => {
    successOpen.value = false
    resetForm()
    vouchers.reset()
  }
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
            :subtitle="`Silakan lengkapi data berikut untuk melakukan request voucher ${VOUCHER_PROGRAM.name}.`"
          />

          <div class="flex flex-col gap-10">
            <PersonalInfoSection :disabled="submitting" />
            <CompanyInfoSection :disabled="submitting" />
          </div>

          <SecurityAssuranceBar :items="SECURITY_ASSURANCES" class="hidden lg:flex" />
        </div>

        <div class="lg:sticky lg:top-14 lg:self-start">
          <VoucherRequestCard
            :program-name="VOUCHER_PROGRAM.name"
            :ticket-category-options="TICKET_CATEGORY_OPTIONS"
            :categories="vouchers.categories"
            :quantities="vouchers.quantities"
            :total="vouchers.totalVouchers.value"
            :submitting="submitting || isSubmitting"
            @update:quantity="vouchers.setQuantity"
            @submit="onSubmit"
          />
        </div>

        <SecurityAssuranceBar :items="SECURITY_ASSURANCES" class="lg:hidden" />
      </form>

      <AppCopyrightFooter class="px-4 pb-6 sm:px-10 lg:px-12" />
    </main>

    <VoucherRequestSuccessDialog
      v-model:open="successOpen"
      :request-id="successRequestId"
      @acknowledge="onSuccessAcknowledge"
    />
  </div>
</template>
