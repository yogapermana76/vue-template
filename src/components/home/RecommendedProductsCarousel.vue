<script setup lang="ts">
  import { useCarouselState } from '@/composables/useCarouselState'
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselIndicators,
  } from '@/components/ui/carousel'
  import { ProductCard } from '@/components/products'
  import type { Product } from '@/services/product'

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

  // Use composable for carousel state  synchronization
  const { carouselRef, currentIndex, handlePrevious, handleNext, handleDotClick } =
    useCarouselState()
</script>

<template>
  <section class="py-8">
    <!-- Section Header -->
    <div class="mb-4 px-4">
      <h2 class="text-2xl font-bold md:text-3xl">{{ props.title }}</h2>
    </div>

    <!-- Carousel -->
    <div class="relative">
      <Carousel ref="carouselRef" class="h-[300px] px-4 md:h-[400px]">
        <CarouselContent gap="gap-4">
          <CarouselItem
            v-for="product in props.products"
            :key="product.id"
            basis="1/2"
            class="md:basis-1/4"
          >
            <ProductCard :product="product" />
          </CarouselItem>
        </CarouselContent>

        <!-- Navigation -->
        <CarouselPrevious
          :disabled="!carouselRef?.canScrollPrev"
          position-class="top-1/3"
          @click="handlePrevious"
        />
        <CarouselNext
          :disabled="!carouselRef?.canScrollNext"
          position-class="top-1/3"
          @click="handleNext"
        />

        <!-- Indicators -->
        <CarouselIndicators
          :total="props.products.length"
          :selected="currentIndex"
          position-class="bottom-32"
          @dot-click="handleDotClick"
        />
      </Carousel>
    </div>
  </section>
</template>
