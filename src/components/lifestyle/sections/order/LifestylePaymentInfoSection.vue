<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import { formatCurrency } from '@/utils/currency'

  export interface PaymentBreakdown {
    ticketPrice: number
    adminFee: number
    discount?: number
    total: number
  }

  export interface LifestylePaymentInfoSectionProps {
    /** Payment breakdown */
    breakdown: PaymentBreakdown
    /** Agreement checkbox state */
    agreedToTerms: boolean
  }

  defineProps<LifestylePaymentInfoSectionProps>()

  const emit = defineEmits<{
    'update:agreed-to-terms': [value: boolean]
    'view-terms': []
  }>()
</script>

<template>
  <section class="flex flex-col gap-3">
    <!-- Section Title -->
    <h2 class="body-l-semibold px-4 text-slate-950">Informasi Pembayaran</h2>

    <!-- Payment Breakdown -->
    <div class="flex flex-col gap-2 px-4">
      <!-- Ticket Price -->
      <div class="flex items-center justify-between gap-2">
        <span class="body-m text-slate-700">Biaya Tiket</span>
        <span class="body-m text-slate-950">{{ formatCurrency(breakdown.ticketPrice) }}</span>
      </div>

      <!-- Admin Fee -->
      <div class="flex items-center justify-between gap-2">
        <span class="body-m text-slate-700">Biaya Admin</span>
        <span class="body-m text-slate-950">{{ formatCurrency(breakdown.adminFee) }}</span>
      </div>

      <!-- Discount (if applicable) -->
      <div
        v-if="breakdown.discount && breakdown.discount > 0"
        class="flex items-center justify-between gap-2"
      >
        <span class="body-m text-slate-700">Diskon Voucher</span>
        <span class="body-m text-success-600">-{{ formatCurrency(breakdown.discount) }}</span>
      </div>

      <!-- Divider -->
      <Divider variant="dashed" />

      <!-- Total -->
      <div class="flex items-center justify-between gap-2">
        <span class="body-l-semibold text-primary-600">Total Pembayaran</span>
        <span class="body-l-semibold text-primary-600">{{ formatCurrency(breakdown.total) }}</span>
      </div>
    </div>

    <!-- Divider -->
    <Divider thick />

    <!-- Terms and Conditions Checkbox -->
    <div class="flex items-start gap-2 px-4">
      <Checkbox
        id="terms-checkbox"
        :checked="agreedToTerms"
        @update:checked="val => emit('update:agreed-to-terms', val === true)"
        class="mt-0.5"
      />
      <div class="flex flex-1 flex-col gap-1">
        <label for="terms-checkbox" class="body-caption cursor-pointer text-slate-950">
          Saya setuju terhadap Syarat dan Ketentuan pembelian tiket di PLN Mobile
        </label>
        <Button
          variant="tertiary"
          size="xs"
          class="body-caption-semibold text-primary-700 h-auto w-fit items-center gap-0.5 p-0"
          @click="emit('view-terms')"
        >
          <span>Lihat Persetujuan</span>
          <ChevronRight class="size-3" />
        </Button>
      </div>
    </div>
  </section>
</template>
