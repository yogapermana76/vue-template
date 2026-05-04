<script setup lang="ts">
  import { ChevronRight, X } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import CouponIcon from '@/assets/icons/coupon.svg?component'
  import EllipseGlowSm from '@/assets/vectors/ellipse-glow-sm.png'
  import LightningGlowLg from '@/assets/vectors/lightning-glow-lg.png'
  import type { SelectedVoucher } from '@/composables/lifestyle/useVoucherSelection'

  export interface LifestylePromoCodeSectionProps {
    /** Selected voucher data */
    selectedVoucher?: SelectedVoucher | null
  }

  defineProps<LifestylePromoCodeSectionProps>()

  const emit = defineEmits<{
    'apply-promo': []
    'remove-voucher': []
  }>()

  const handleRemoveVoucher = (event: Event) => {
    event.stopPropagation()
    emit('remove-voucher')
  }
</script>

<template>
  <button
    type="button"
    class="relative flex h-13 w-full items-center gap-3 overflow-hidden rounded-lg bg-linear-to-b from-[#051D41] via-[#093552] to-[#0B283B] px-4 transition-all hover:opacity-90 active:scale-[0.98] active:opacity-80"
    @click="$emit('apply-promo')"
  >
    <!-- Lightning Glow Decoration -->
    <img :src="LightningGlowLg" alt="" class="pointer-events-none absolute -right-24 -bottom-20" />

    <!-- Ellipse Glow Decoration -->
    <img
      :src="EllipseGlowSm"
      alt=""
      class="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
    />

    <!-- Icon -->
    <CouponIcon />

    <!-- Text -->
    <div class="relative z-10 flex flex-1 flex-col items-start gap-0.5">
      <span v-if="!selectedVoucher" class="body-m-semibold text-white">Masukkan Kode Promo</span>
      <template v-else>
        <span class="body-caption text-white/80">Kode Promo Aktif</span>
        <span class="body-m-semibold text-white">{{ selectedVoucher.title }}</span>
      </template>
    </div>

    <!-- Remove button (when voucher is selected) -->
    <Button
      v-if="selectedVoucher"
      variant="tertiary"
      size="xs"
      layout="iconOnly"
      is-dark-bg
      class="relative z-10 size-7! rounded-full! bg-white/20! p-0! hover:bg-white/30! active:bg-white/25!"
      @click="handleRemoveVoucher"
    >
      <X class="size-5 text-white!" stroke-width="2.5" />
    </Button>

    <!-- Chevron (when no voucher selected) -->
    <ChevronRight v-else class="relative z-10 size-5 shrink-0 text-white" />
  </button>
</template>
