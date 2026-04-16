<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCarouselState } from '@/composables/carousel'
  import { GradientSection } from '@/components/layout'
  import { InfoCard } from '@/components/rewards'
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselIndicators,
  } from '@/components/ui/carousel'
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

  // Use carousel composable (includes handleDotClick)
  const { carouselRef, currentIndex, handleDotClick } = useCarouselState()

  // Handle info card click
  const handleInfoCardClick = (itemId: number) => {
    router.push({
      path: '/rewards/how-to-detail',
      query: { id: itemId },
    })
  }
</script>

<template>
  <GradientSection gradient="navy" :rounded-bottom="false" class="py-4">
    <!-- Section Title -->
    <h2 class="body-l-semibold mb-4 px-4 text-white">Cara Menggunakan Rewards</h2>

    <!-- Carousel -->
    <Carousel ref="carouselRef">
      <CarouselContent gap="gap-3">
        <CarouselItem v-for="item in items" :key="item.id" basis="1/3" class="min-w-36">
          <InfoCard :title="item.title" :image="item.image" @click="handleInfoCardClick(item.id)" />
        </CarouselItem>
      </CarouselContent>

      <!-- Indicators - using outside slot for positioning below carousel -->
      <template #outside>
        <CarouselIndicators
          :total="items.length"
          :selected="currentIndex"
          position-class="relative mt-2 justify-start px-4"
          indicator-class="bg-white"
          @dot-click="handleDotClick"
        />
      </template>
    </Carousel>
  </GradientSection>
</template>
