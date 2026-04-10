<script setup lang="ts">
  import { useCarouselState } from '@/composables/carousel'
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

  const props = withDefaults(defineProps<Props>(), {
    slides: () => [
      {
        id: 1,
        title: 'Discover Amazing Products',
        description: 'Explore our curated collection of high-quality items',
        badge: 'New Collection',
        image: 'https://picsum.photos/800/400?random=1',
        cta: 'Shop Now',
      },
      {
        id: 2,
        title: 'Summer Sale - Up to 50% Off',
        description: 'Limited time offer on selected items',
        badge: 'Hot Deals',
        image: 'https://picsum.photos/800/400?random=2',
        cta: 'Browse Deals',
      },
      {
        id: 3,
        title: 'Premium Quality Guaranteed',
        description: 'We only offer the best products for our customers',
        badge: 'Premium',
        image: 'https://picsum.photos/800/400?random=3',
        cta: 'Learn More',
      },
    ],
  })

  // Use composable for carousel state synchronization
  const { carouselRef, currentIndex, handlePrevious, handleNext, handleDotClick } =
    useCarouselState()
</script>

<template>
  <section class="w-full">
    <Carousel ref="carouselRef" :autoplay="true" :autoplay-delay="5000" class="h-72 w-full">
      <CarouselContent>
        <CarouselItem v-for="slide in props.slides" :key="slide.id" basis="full">
          <div class="relative h-full w-full overflow-hidden rounded-lg">
            <!-- Background Image -->
            <img
              v-if="slide.image"
              :src="slide.image"
              :alt="slide.title"
              class="absolute inset-0 size-full object-cover"
              loading="lazy"
              decoding="async"
            />

            <!-- Overlay gradient -->
            <div
              class="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent"
            />

            <!-- Content -->
            <div class="absolute inset-0 flex flex-col justify-center px-6">
              <Badge v-if="slide.badge" variant="secondary" class="mb-3 w-fit">
                {{ slide.badge }}
              </Badge>

              <h2 class="heading-m mb-2 max-w-xl text-white">
                {{ slide.title }}
              </h2>

              <p class="body-m mb-4 max-w-md text-neutral-200">
                {{ slide.description }}
              </p>

              <div>
                <Button
                  size="lg"
                  class="bg-white text-neutral-950 hover:bg-neutral-100 active:bg-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400"
                >
                  {{ slide.cta || 'Learn More' }}
                </Button>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>

      <!-- Navigation -->
      <CarouselPrevious :disabled="!carouselRef?.canScrollPrev" @click="handlePrevious" />
      <CarouselNext :disabled="!carouselRef?.canScrollNext" @click="handleNext" />

      <!-- Indicators -->
      <CarouselIndicators
        :total="props.slides.length"
        :selected="currentIndex"
        @dot-click="handleDotClick"
      />
    </Carousel>
  </section>
</template>
