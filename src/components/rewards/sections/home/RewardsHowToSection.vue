<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMediaQuery } from '@vueuse/core'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination } from 'swiper/modules'
  import { GradientSection } from '@/components/layout'
  import { InfoCard, InfoCardSkeleton } from '@/components/rewards'
  import { SwiperPagination } from '@/components/ui/swiper'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useFYI } from '@/composables/services'
  import { useResponsiveMaxWidth } from '@/composables/ui/useResponsiveMaxWidth'
  import { useSwiperStyles } from '@/composables/ui/useSwiperStyles'
  import type { FYIItem } from '@/types'
  import RiwayatIllustration from '@/assets/illustrations/history.png'

  useSwiperStyles()

  const router = useRouter()
  const { isDesktop, responsiveMaxWidth } = useResponsiveMaxWidth()

  const { data: fyiData, isPending, isError } = useFYI()
  const fyiItems = computed(() => (fyiData.value?.data ?? []) as FYIItem[])

  // Responsive breakpoints for slides per view
  const breakpoints = [
    { query: '(min-width: 340px) and (max-width: 344px)', value: 2.05 },
    { query: '(max-width: 360px)', value: 2.15 },
    { query: '(max-width: 375px)', value: 2.27 },
    { query: '(max-width: 390px)', value: 2.3 },
    { query: '(max-width: 414px)', value: 2.5 },
    { query: '(max-width: 430px)', value: 2.6 },
    { query: '(max-width: 540px)', value: 3.3 },
    { query: '(min-width: 541px) and (max-width: 768px)', value: 4.7 },
    { query: '(min-width: 769px) and (max-width: 820px)', value: 5 },
    { query: '(min-width: 821px) and (max-width: 853px)', value: 5.2 },
    { query: '(min-width: 854px) and (max-width: 912px)', value: 5.7 },
    { query: '(min-width: 913px)', value: 5.0 },
  ].map(bp => ({ matches: useMediaQuery(bp.query), value: bp.value }))

  const slidesPerView = computed(() => {
    if (isDesktop.value && responsiveMaxWidth.value) return 2.6
    return breakpoints.find(bp => bp.matches.value)?.value ?? 2.6
  })

  const handleInfoCardClick = (item: FYIItem) => {
    router.push(`/rewards/fyi/${item.order}`)
  }

  const modules = [Pagination]
</script>

<template>
  <GradientSection gradient="navy" show-ellipse-glow :rounded-bottom="false" class="py-4">
    <h2 class="body-l-semibold mb-4 px-4 text-white">Cara Menggunakan Rewards</h2>

    <div v-if="isPending">
      <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :slides-offset-before="16"
        :slides-offset-after="8"
      >
        <swiper-slide v-for="i in 3" :key="`skeleton-${i}`">
          <InfoCardSkeleton />
        </swiper-slide>
      </swiper>
    </div>

    <div v-else-if="isError" class="flex flex-col items-center justify-center px-4 py-8">
      <EmptyState
        :image="RiwayatIllustration"
        title="Gagal memuat data"
        description="Terjadi kesalahan saat memuat data. Silakan coba lagi."
        title-class="text-white"
        description-class="text-white/80"
      />
    </div>

    <div
      v-else-if="fyiItems.length === 0"
      class="flex flex-col items-center justify-center px-4 py-8"
    >
      <EmptyState
        :image="RiwayatIllustration"
        title="Belum ada informasi"
        description="Informasi belum tersedia saat ini."
        title-class="text-white"
        description-class="text-white/80"
      />
    </div>

    <div v-else>
      <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :slides-offset-before="16"
        :slides-offset-after="8"
        :pagination="{ clickable: true, el: '#swiper-pagination-custom' }"
      >
        <swiper-slide v-for="item in fyiItems" :key="item.order">
          <InfoCard
            :title="item.question"
            :image="item.imageUrl"
            @click="handleInfoCardClick(item)"
          />
        </swiper-slide>
      </swiper>

      <SwiperPagination id="swiper-pagination-custom" variant="small" class="mt-2 px-4" />
    </div>
  </GradientSection>
</template>
