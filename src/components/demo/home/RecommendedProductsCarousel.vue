<script setup lang="ts">
  import { computed } from 'vue'
  import { useMediaQuery } from '@vueuse/core'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination, Navigation } from 'swiper/modules'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import { ProductCard } from '@/components/demo/products'
  import { SwiperPagination } from '@/components/ui/swiper'
  import { IconButton } from '@/components/ui/button'
  import { useSwiperStyles } from '@/composables/ui/useSwiperStyles'
  import type { Product } from '@/services/demo/product.service'

  useSwiperStyles()

  interface Props {
    products?: Product[]
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Recommended for You',
    products: () => [
      {
        id: 1,
        title: 'Premium Headphones',
        price: 299.99,
        description: 'High-quality audio',
        category: 'Electronics',
        image: 'https://picsum.photos/300/300?random=1',
        rating: { rate: 4.5, count: 128 },
      },
      {
        id: 2,
        title: 'Wireless Mouse',
        price: 49.99,
        description: 'Ergonomic design',
        category: 'Electronics',
        image: 'https://picsum.photos/300/300?random=2',
        rating: { rate: 4.2, count: 94 },
      },
      {
        id: 3,
        title: 'USB-C Cable',
        price: 19.99,
        description: 'Fast charging',
        category: 'Accessories',
        image: 'https://picsum.photos/300/300?random=3',
        rating: { rate: 4.8, count: 203 },
      },
      {
        id: 4,
        title: 'Phone Stand',
        price: 29.99,
        description: 'Adjustable angle',
        category: 'Accessories',
        image: 'https://picsum.photos/300/300?random=4',
        rating: { rate: 4.6, count: 156 },
      },
      {
        id: 5,
        title: 'Screen Protector',
        price: 9.99,
        description: 'Tempered glass',
        category: 'Accessories',
        image: 'https://picsum.photos/300/300?random=5',
        rating: { rate: 4.3, count: 312 },
      },
    ],
  })

  const isSmallScreen = useMediaQuery('(max-width: 640px)')

  const slidesPerView = computed(() => (isSmallScreen.value ? 2 : 2.5))

  const modules = [Pagination, Navigation]
</script>

<template>
  <section class="bg-primary-50/50 py-8">
    <!-- Section Header -->
    <div class="mb-4 px-4">
      <h2 class="text-xl font-bold text-neutral-900">{{ props.title }}</h2>
    </div>

    <!-- Swiper -->
    <div class="relative">
      <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :space-between="16"
        :slides-offset-before="16"
        :slides-offset-after="16"
        :pagination="{ clickable: true, el: '#swiper-pagination-products' }"
        :navigation="{
          prevEl: '#swiper-button-prev-products',
          nextEl: '#swiper-button-next-products',
        }"
      >
        <swiper-slide v-for="product in props.products" :key="product.id">
          <ProductCard :product="product" />
        </swiper-slide>
      </swiper>

      <!-- Custom Navigation Buttons -->
      <IconButton
        id="swiper-button-prev-products"
        variant="primary"
        size="md"
        class="absolute top-1/2 left-0 z-10 -translate-y-1/2"
        title="Previous slide"
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        id="swiper-button-next-products"
        variant="primary"
        size="md"
        class="absolute top-1/2 right-0 z-10 -translate-y-1/2"
        title="Next slide"
      >
        <ChevronRight />
      </IconButton>

      <!-- Pagination -->
      <SwiperPagination
        id="swiper-pagination-products"
        variant="small"
        color="primary"
        class="mt-2 px-4"
      />
    </div>
  </section>
</template>
