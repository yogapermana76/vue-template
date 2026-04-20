<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useClipboard } from '@vueuse/core'
  import { Header, Footer, HeroBanner } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { useToast } from '@/composables/ui'
  import {
    RewardProgramInfo,
    RewardTermsSection,
    RewardDetailSkeleton,
  } from '@/components/rewards/sections'
  import { LotteryCodesBottomSheet } from '@/components/rewards/bottom-sheets'
  import {
    useUserLotteryDetail,
    useUserGiftInstantlyDetail,
    useVoucherDetail,
  } from '@/composables/services'

  definePage({
    meta: {
      title: 'Detail',
    },
  })

  const route = useRoute()
  const router = useRouter()

  // Bottom sheet state for lottery coupon codes
  const isLotteryCodesOpen = ref(false)

  // Get ID and type from route params and query
  const rewardId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })
  const rewardType = computed(() => (route.query.type as string) || 'voucher')

  // Fetch lottery detail if type is lottery-coupon
  const { data: lotteryDetailData, isPending: isLotteryPending } = useUserLotteryDetail({
    params: { id: rewardId },
    options: {
      enabled: computed(() => rewardType.value === 'lottery-coupon'),
    },
  })

  const lotteryDetail = computed(() => lotteryDetailData.value?.data)

  // Fetch gift instantly detail if type is item
  const { data: giftInstantlyDetailData, isPending: isGiftPending } = useUserGiftInstantlyDetail({
    params: { userPointId: rewardId },
    options: {
      enabled: computed(() => rewardType.value === 'item'),
    },
  })

  const giftInstantlyDetail = computed(() => giftInstantlyDetailData.value?.data)

  // Fetch voucher detail if type is voucher
  const voucherCode = computed(() => (route.query.voucherCode as string) || '')
  const { data: voucherDetailData, isPending: isVoucherPending } = useVoucherDetail({
    params: {
      voucherId: rewardId,
      voucherCode: voucherCode,
    },
    options: {
      enabled: computed(() => rewardType.value === 'voucher'),
    },
  })

  const voucherDetail = computed(() => voucherDetailData.value?.data)

  // Combined loading state
  const isPending = computed(() => {
    if (rewardType.value === 'lottery-coupon') return isLotteryPending.value
    if (rewardType.value === 'item') return isGiftPending.value
    return isVoucherPending.value
  })

  // Image URL - uses API data for all types
  const imageUrl = computed(() => {
    if (rewardType.value === 'lottery-coupon' && lotteryDetail.value) {
      return lotteryDetail.value.imageUrl
    }
    if (rewardType.value === 'item' && giftInstantlyDetail.value) {
      return giftInstantlyDetail.value.imageUrl || undefined
    }
    if (rewardType.value === 'voucher' && voucherDetail.value) {
      return voucherDetail.value.imageUrl || undefined
    }
    return undefined
  })

  // Program info - uses API data for all types
  const programInfo = computed(() => {
    if (rewardType.value === 'lottery-coupon' && lotteryDetail.value) {
      return {
        title: lotteryDetail.value.title,
        description: lotteryDetail.value.description,
      }
    }

    if (rewardType.value === 'item' && giftInstantlyDetail.value) {
      return {
        title: giftInstantlyDetail.value.title,
        description: giftInstantlyDetail.value.description,
      }
    }

    if (rewardType.value === 'voucher' && voucherDetail.value) {
      return {
        title: voucherDetail.value.title,
        description: voucherDetail.value.description,
      }
    }

    // Fallback for voucher type when no data
    return {
      title: '',
      description: '',
    }
  })

  // Helper function to format term value (array or string)
  const formatTermValue = (value: string | string[]) => {
    return Array.isArray(value)
      ? `<ol class="list-decimal pl-5 flex flex-col gap-2">${value.map(item => `<li class="pl-1">${item}</li>`).join('')}</ol>`
      : value
  }

  // Helper function to generate terms and conditions content
  const generateTermsContent = (termsCondition: { label: string; value: string | string[] }[]) => {
    return termsCondition
      .map(
        term =>
          `<p class="body-caption-semibold text-slate-950 mb-2">${term.label}</p>${formatTermValue(term.value)}`,
      )
      .join('<div class="mt-4"></div>')
  }

  // Terms items - includes both "Cara Penggunaan" and "Syarat dan Ketentuan"
  const termsItems = computed(() => {
    const items = []

    // For item type, use API data
    if (rewardType.value === 'item' && giftInstantlyDetail.value?.termsCondition?.length) {
      items.push({
        id: 'terms-and-conditions',
        title: 'Syarat dan Ketentuan',
        content: generateTermsContent(giftInstantlyDetail.value.termsCondition),
      })
      return items
    }

    // For voucher type, use API data
    if (rewardType.value === 'voucher' && voucherDetail.value) {
      // Add "Cara Penggunaan" if exists
      if (voucherDetail.value.howToUse?.length) {
        const howToUseSteps = voucherDetail.value.howToUse.map(step => `<li>${step}</li>`).join('')
        items.push({
          id: 'how-to-use',
          title: 'Cara Penggunaan',
          content: `<ol style="list-style-type: decimal; padding-left: 1.25rem;">${howToUseSteps}</ol>`,
        })
      }

      // Add "Syarat dan Ketentuan" if exists (array of strings)
      if (voucherDetail.value.termsCondition?.length) {
        const termsSteps = voucherDetail.value.termsCondition
          .map(term => `<li class="pl-1">${term}</li>`)
          .join('')
        items.push({
          id: 'terms-and-conditions',
          title: 'Syarat dan Ketentuan',
          content: `<ol class="list-decimal pl-5 flex flex-col gap-2">${termsSteps}</ol>`,
        })
      }

      return items
    }

    // For lottery-coupon type, use API data
    if (rewardType.value === 'lottery-coupon' && lotteryDetail.value?.termsCondition?.length) {
      items.push({
        id: 'terms-and-conditions',
        title: 'Syarat dan Ketentuan',
        content: generateTermsContent(lotteryDetail.value.termsCondition),
      })
      return items
    }

    return []
  })

  // Clipboard and toast for voucher code copy
  const { copy } = useClipboard()
  const { success: toastSuccess } = useToast()

  // Voucher code info from API
  const voucherCodeInfo = computed(() => voucherDetail.value?.voucherCode)

  // Dynamic button configuration
  const showFooterButton = computed(() => {
    // Hide footer for item type
    if (rewardType.value === 'item') return false
    // Show footer for voucher type if voucherCode info exists
    if (rewardType.value === 'voucher') {
      return !!voucherCodeInfo.value
    }
    return true
  })

  const buttonConfig = computed(() => {
    if (rewardType.value === 'lottery-coupon') {
      return {
        label: 'Lihat Kupon',
        action: () => {
          isLotteryCodesOpen.value = true
        },
      }
    }

    // Voucher type with CODE - copy to clipboard
    if (rewardType.value === 'voucher' && voucherCodeInfo.value?.type === 'CODE') {
      return {
        label: 'Salin Kode',
        action: () => {
          if (voucherCodeInfo.value?.value) {
            copy(voucherCodeInfo.value.value)
            toastSuccess('Kode berhasil disalin')
          }
        },
      }
    }

    // Voucher type with LINK - open URL
    if (rewardType.value === 'voucher' && voucherCodeInfo.value?.type === 'LINK') {
      return {
        label: 'Klaim Voucher',
        action: () => {
          if (voucherCodeInfo.value?.value) {
            window.open(voucherCodeInfo.value.value, '_blank')
          }
        },
      }
    }

    // Default fallback
    return {
      label: 'Gunakan Voucher',
      action: () => {
        router.push('/electricity/token-purchase')
      },
    }
  })

  // Lottery coupon count for footer display
  const lotteryCouponCount = computed(() => {
    if (rewardType.value === 'lottery-coupon' && lotteryDetail.value) {
      return lotteryDetail.value.redeemCount
    }
    return 0
  })

  // Footer display info
  const footerDisplayInfo = computed(() => {
    if (rewardType.value === 'lottery-coupon' && lotteryDetail.value) {
      return {
        label: 'Jumlah Kupon',
        value: `${lotteryCouponCount.value} Kupon`,
      }
    }

    if (rewardType.value === 'voucher' && voucherCodeInfo.value?.type === 'CODE') {
      return {
        label: 'Kode',
        value: voucherCodeInfo.value.value,
      }
    }

    return null
  })

  // Address for item type
  const address = computed(() => {
    if (rewardType.value === 'item' && giftInstantlyDetail.value) {
      return {
        fullname: giftInstantlyDetail.value.fullname,
        phoneNumber: giftInstantlyDetail.value.phoneNumber,
        provinceName: giftInstantlyDetail.value.provinceName,
        cityName: giftInstantlyDetail.value.cityName,
        districtName: giftInstantlyDetail.value.districtName,
        postalCode: giftInstantlyDetail.value.postalCode,
      }
    }
    return undefined
  })
</script>

<template>
  <!-- Header -->
  <Header title="Detail" positioning="sticky" />

  <!-- Loading State -->
  <template v-if="isPending">
    <RewardDetailSkeleton />
  </template>

  <!-- Loaded State -->
  <template v-else>
    <!-- Hero Banner Section -->
    <HeroBanner :src="imageUrl" />

    <!-- Content -->
    <main class="flex flex-1 flex-col gap-6 px-4" :class="showFooterButton ? 'pb-24' : 'pb-6'">
      <!-- Program Info Section -->
      <RewardProgramInfo :program-info="programInfo" :address="address" />

      <!-- Terms & Conditions Section -->
      <RewardTermsSection v-if="termsItems.length > 0" :items="termsItems" />
    </main>

    <!-- Footer with Button -->
    <Footer v-if="showFooterButton && !isPending" position="fixed">
      <!-- Footer display info -->
      <div v-if="footerDisplayInfo" class="flex w-full items-center justify-between gap-2">
        <p class="body-m text-slate-950">{{ footerDisplayInfo.label }}</p>
        <p class="body-l-semibold text-slate-950">{{ footerDisplayInfo.value }}</p>
      </div>

      <Button variant="primary" size="sm" class="w-full" @click="buttonConfig.action">
        {{ buttonConfig.label }}
      </Button>
    </Footer>
  </template>

  <!-- Lottery Codes Bottom Sheet -->
  <LotteryCodesBottomSheet v-model:open="isLotteryCodesOpen" :lottery-detail="lotteryDetail" />
</template>
