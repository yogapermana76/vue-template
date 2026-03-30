<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
  } from '@/components/ui/carousel'
  import { ProductCard } from '@/components/products'
  import type { Product } from '@/services/product'

  interface Props {
    products?: Product[]
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Recommended for You',
    products: () => [
      {
        id: 1,
        title: 'Premium Headphones',
        price: 299.99,
        description: 'High-quality audio',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        rating: { rate: 4.5, count: 128 },
      },
      {
        id: 2,
        title: 'Wireless Mouse',
        price: 49.99,
        description: 'Ergonomic design',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop',
        rating: { rate: 4.2, count: 94 },
      },
      {
        id: 3,
        title: 'USB-C Cable',
        price: 19.99,
        description: 'Fast charging',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1588872657840-218e412ee62e?w=300&h=300&fit=crop',
        rating: { rate: 4.8, count: 203 },
      },
      {
        id: 4,
        title: 'Phone Stand',
        price: 29.99,
        description: 'Adjustable angle',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1586435984159-0e1b57e8d4a5?w=300&h=300&fit=crop',
        rating: { rate: 4.6, count: 156 },
      },
      {
        id: 5,
        title: 'Screen Protector',
        price: 9.99,
        description: 'Tempered glass',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1606933248051-5ce98750ebdf?w=300&h=300&fit=crop',
        rating: { rate: 4.3, count: 312 },
      },
    ],
  })

  const carouselRef = ref()

  const handlePrevious = () => carouselRef.value?.scrollPrev()
  const handleNext = () => carouselRef.value?.scrollNext()
</script>

<template>
  <section class="py-12 md:py-16">
    <!-- Section Header -->
    <div class="mb-6 px-4 md:mb-8">
      <h2 class="text-2xl font-bold md:text-3xl">{{ title }}</h2>
    </div>

    <!-- Carousel -->
    <div class="relative">
      <Carousel ref="carouselRef" class="px-4">
        <CarouselContent>
          <CarouselItem
            v-for="product in products"
            :key="product.id"
            basis="1/2"
            class="md:basis-1/4"
          >
            <ProductCard :product="product" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!-- Navigation -->
      <CarouselPrevious
        :disabled="carouselRef?.isBeginning"
        class="left-0"
        @click="handlePrevious"
      />
      <CarouselNext :disabled="carouselRef?.isEnd" class="right-0" @click="handleNext" />
    </div>
  </section>
</template>
