<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination } from 'swiper/modules'

  import { GradientSection } from '@/components/layout'
  import { InfoCard } from '@/components/rewards'
  import { SwiperPagination } from '@/components/ui/swiper'
  import FyiImg1 from '@/assets/images/fyi-img-1.png'
  import FyiImg2 from '@/assets/images/fyi-img-2.png'
  import FyiImg3 from '@/assets/images/fyi-img-3.png'
  import { useFYI } from '@/composables'

  interface HowToItem {
    id: number
    title: string
    image: string
  }

  const router = useRouter()

  // Mock data
  const items = ref<HowToItem[]>([
    {
      id: 1,
      title: 'Bagaimana mendapatkan poin?',
      image: FyiImg1,
    },
    {
      id: 2,
      title: 'Bagaimana mengikuti Undian Berhadiah?',
      image: FyiImg2,
    },
    {
      id: 3,
      title: 'Periode penukaran kupon',
      image: FyiImg3,
    },
  ])

  // Public data
  const { data: fyiData } = useFYI()

  // Debug: log data on change
  watch(fyiData, val => {
    // eslint-disable-next-line no-console
    console.log('FYI Data:', val)
  })

  // Handle info card click
  const handleInfoCardClick = (itemId: number) => {
    router.push({
      path: '/rewards/how-to-detail',
      query: { id: itemId },
    })
  }

  const modules = [Pagination]
</script>

<template>
  <GradientSection gradient="navy" :rounded-bottom="false" class="py-4">
    <!-- Section Title -->
    <h2 class="body-l-semibold mb-4 px-4 text-white">Cara Menggunakan Rewards</h2>

    <!-- Swiper Carousel -->
    <div>
      <swiper
        :modules="modules"
        :slides-per-view="2.6"
        :slides-offset-before="16"
        :slides-offset-after="8"
        :pagination="{ clickable: true, el: '#swiper-pagination-custom' }"
      >
        <swiper-slide v-for="item in items" :key="item.id">
          <InfoCard :title="item.title" :image="item.image" @click="handleInfoCardClick(item.id)" />
        </swiper-slide>
      </swiper>

      <!-- Custom pagination container -->
      <SwiperPagination id="swiper-pagination-custom" variant="small" class="mt-2 px-4" />
    </div>
  </GradientSection>
</template>
