<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'
  import CouponIcon from '@/assets/icons/coupon.svg?component'
  import EllipseGlowSm from '@/assets/vectors/ellipse-glow-sm.png'
  import LightningGlowLg from '@/assets/vectors/lightning-glow-lg.png'

  defineEmits<{
    'apply-promo': []
  }>()
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
      <span class="body-m-semibold text-white">Masukkan Kode Promo</span>
    </div>

    <!-- Chevron -->
    <ChevronRight class="relative z-10 size-5 shrink-0 text-white" />
  </button>
</template>
