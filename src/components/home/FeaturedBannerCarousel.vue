<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselIndicators,
  } from '@/components/ui/carousel'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'

  interface Props {
    slides?: Array<{
      id: number
      title: string
      description: string
      badge?: string
      image?: string
      cta?: string
    }>
  }

  withDefaults(defineProps<Props>(), {
    slides: () => [
      {
        id: 1,
        title: 'Discover Amazing Products',
        description: 'Explore our curated collection of high-quality items',
        badge: 'New Collection',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
        cta: 'Shop Now',
      },
      {
        id: 2,
        title: 'Summer Sale - Up to 50% Off',
        description: 'Limited time offer on selected items',
        badge: 'Hot Deals',
        image: 'https://images.unsplash.com/photo-1556821552-5ff63b1b66d5?w=800&h=400&fit=crop',
        cta: 'Browse Deals',
      },
      {
        id: 3,
        title: 'Premium Quality Guaranteed',
        description: 'We only offer the best products for our customers',
        badge: 'Premium',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
        cta: 'Learn More',
      },
    ],
  })

  const carouselRef = ref()
  const selectedIndex = ref(0)

  const handlePrevious = () => carouselRef.value?.scrollPrev()
  const handleNext = () => carouselRef.value?.scrollNext()
</script>

<template>
  <section class="relative py-8 md:py-12">
    <Carousel
      ref="carouselRef"
      :autoplay="true"
      :autoplay-delay="5000"
      class="overflow-hidden rounded-lg"
    >
      <CarouselContent>
        <CarouselItem v-for="slide in slides" :key="slide.id" basis="full">
          <div
            class="bg-muted relative aspect-video w-full overflow-hidden rounded-lg md:aspect-[2/1]"
          >
            <!-- Background Image -->
            <img
              v-if="slide.image"
              :src="slide.image"
              :alt="slide.title"
              class="absolute inset-0 size-full object-cover"
            />

            <!-- Overlay gradient -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"
            />

            <!-- Content -->
            <div class="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
              <Badge v-if="slide.badge" variant="secondary" class="mb-3 w-fit">
                {{ slide.badge }}
              </Badge>

              <h2 class="mb-2 max-w-xl text-2xl font-bold text-white md:text-4xl">
                {{ slide.title }}
              </h2>

              <p class="text-muted mb-6 max-w-md text-sm text-gray-200 md:text-base">
                {{ slide.description }}
              </p>

              <div>
                <Button class="bg-white text-black hover:bg-gray-200">
                  {{ slide.cta || 'Learn More' }}
                </Button>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>

      <!-- Navigation -->
      <CarouselPrevious :disabled="carouselRef?.isBeginning" @click="handlePrevious" />
      <CarouselNext :disabled="carouselRef?.isEnd" @click="handleNext" />

      <!-- Indicators -->
      <CarouselIndicators
        :total="slides.length"
        :selected="selectedIndex"
        @dot-click="carouselRef?.scrollTo"
      />
    </Carousel>
  </section>
</template>
