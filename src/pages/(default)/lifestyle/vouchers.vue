<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Header, GradientSection } from '@/components/layout'
  import { VoucherInputCard, VoucherCard } from '@/components/lifestyle/cards'
  import { Divider } from '@/components/ui/divider'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useVoucherSelection } from '@/composables/lifestyle'

  definePage({
    meta: {
      title: 'Voucher Saya',
    },
  })

  const { selectedVoucher, applyVoucher, goBack } = useVoucherSelection()

  // ============================================
  // State
  // ============================================

  const voucherCode = ref('')
  const isApplyingCode = ref(false)

  // Mock data - replace with actual API call
  const myVouchers = ref([
    {
      id: '1',
      title: 'Voucher Gelegar Rp 5.000',
      expiryText: 'Hingga 31/12/2025',
      infoText: 'min pembelian token 5rb',
      state: 'default' as const,
      showFlag: false,
      flagText: 'Tersisa 5 Voucher',
    },
    {
      id: '2',
      title: 'Potongan Token Rp 100.000',
      expiryText: 'Hingga 31/12/2025',
      infoText: 'min pembelian token 5rb',
      state: 'default' as const,
      showFlag: true,
      flagText: 'Tersisa 5 Voucher',
    },
  ])

  const unusableVouchers = ref([
    {
      id: '3',
      title: 'Potongan Token Rp 50.000',
      expiryText: 'Hingga 31/12/2025',
      infoText: 'min pembelian token 5rb',
      state: 'disabled' as const,
      showFlag: true,
      flagText: 'Tersisa 5 Voucher',
    },
    {
      id: '4',
      title: 'Potongan Token Rp 50.000',
      expiryText: 'Hingga 31/12/2025',
      infoText: 'min pembelian token 5rb',
      state: 'disabled' as const,
      showFlag: true,
      flagText: 'Tersisa 5 Voucher',
    },
  ])

  // ============================================
  // Computed
  // ============================================

  const hasMyVouchers = computed(() => myVouchers.value.length > 0)
  const hasUnusableVouchers = computed(() => unusableVouchers.value.length > 0)

  // ============================================
  // Methods
  // ============================================

  const handleApplyCode = async (code: string) => {
    isApplyingCode.value = true
    try {
      // TODO: Call API to validate and apply voucher code
      // eslint-disable-next-line no-console
      console.log('Apply voucher code:', code)
      voucherCode.value = ''
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to apply voucher:', error)
    } finally {
      isApplyingCode.value = false
    }
  }

  const handleVoucherSelect = (voucherId: string) => {
    // Find the selected voucher from either list
    const allVouchers = [...myVouchers.value, ...unusableVouchers.value]
    const voucher = allVouchers.find(v => v.id === voucherId)

    if (!voucher) return

    // Apply voucher and navigate back
    applyVoucher({
      id: voucher.id,
      code: voucher.id, // TODO: Replace with actual voucher code from API
      title: voucher.title,
      discountAmount: 5000, // TODO: Get from API
    })
  }

  const handleVoucherDetail = (voucherId: string) => {
    // eslint-disable-next-line no-console
    console.log('View voucher detail:', voucherId)
    // TODO: Navigate to voucher detail or show bottom sheet
  }
</script>

<template>
  <!-- Header -->
  <Header title="Voucher Saya" positioning="fixed" transparent @back="goBack" />

  <!-- Hero Section with Gradient -->
  <GradientSection gradient="voucher" class="px-4 pb-8">
    <VoucherInputCard
      v-model="voucherCode"
      title="Masukkan Kode Voucher"
      description="Biar makin hemat masukkan atau pilih voucher yang Anda miliki"
      placeholder="Masukkan kode voucher"
      button-label="Pakai"
      :loading="isApplyingCode"
      @apply="handleApplyCode"
    />
  </GradientSection>

  <!-- Main Content (White Background) -->
  <main class="flex flex-col gap-5 pb-6">
    <!-- My Vouchers Section -->
    <section v-if="hasMyVouchers" class="flex flex-col gap-3 px-4">
      <h2 class="heading-s text-slate-950">Voucher Saya</h2>

      <div class="flex flex-col gap-4">
        <VoucherCard
          v-for="voucher in myVouchers"
          :key="voucher.id"
          :title="voucher.title"
          :expiry-text="voucher.expiryText"
          :info-text="voucher.infoText"
          :state="selectedVoucher?.id === voucher.id ? 'selected' : voucher.state"
          :show-flag="voucher.showFlag"
          :flag-text="voucher.flagText"
          button-label="Lihat Detail"
          @card-click="handleVoucherSelect(voucher.id)"
          @button-click="handleVoucherDetail(voucher.id)"
        />
      </div>
    </section>

    <!-- Divider -->
    <Divider v-if="hasMyVouchers && hasUnusableVouchers" thick />

    <!-- Unusable Vouchers Section -->
    <section v-if="hasUnusableVouchers" class="flex flex-col gap-3 px-4">
      <div class="flex flex-col gap-1">
        <h2 class="heading-s text-slate-950">Voucher yang belum bisa dipakai</h2>
        <p class="body-caption text-slate-500">
          Voucher tidak berlaku untuk transaksi yang kamu pilih.
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <VoucherCard
          v-for="voucher in unusableVouchers"
          :key="voucher.id"
          :title="voucher.title"
          :expiry-text="voucher.expiryText"
          :info-text="voucher.infoText"
          :state="voucher.state"
          :show-flag="voucher.showFlag"
          :flag-text="voucher.flagText"
          button-label="Lihat Detail"
          @button-click="handleVoucherDetail(voucher.id)"
        />
      </div>
    </section>

    <!-- Empty State (when no vouchers) -->
    <EmptyState
      v-if="!hasMyVouchers && !hasUnusableVouchers"
      class="py-20"
      title="Belum ada voucher tersedia"
      description="Masukkan kode voucher di atas atau tunggu voucher baru dari kami"
    />
  </main>
</template>
