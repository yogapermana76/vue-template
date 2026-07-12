<script setup lang="ts">
  import { FadeCarousel } from '@/components/ui/swiper'
  import type { BannerURL } from '@/types/services'

  defineProps<{
    banners: BannerURL[]
    loading?: boolean
  }>()
</script>

<template>
  <FadeCarousel
    v-if="!loading"
    :slides="banners"
    :autoplay-delay="6000"
    :allow-touch-move="false"
    class="absolute inset-0"
  >
    <template #slide="{ item }">
      <div class="relative h-full w-full">
        <img :src="item" alt="" class="h-full w-full object-cover" loading="lazy" />
        <div
          class="from-primary-950/95 via-primary-950/70 to-primary-900/20 pointer-events-none absolute inset-0 bg-linear-to-r"
        />
      </div>
    </template>

    <template #empty>
      <div class="from-primary-900 to-primary-950 absolute inset-0 bg-linear-to-br" />
    </template>
  </FadeCarousel>
</template>
