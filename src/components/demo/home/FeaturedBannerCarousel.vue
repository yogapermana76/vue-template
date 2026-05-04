<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination, Autoplay, Navigation } from 'swiper/modules'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import { Button, IconButton } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Image } from '@/components/ui'
  import { SwiperPagination } from '@/components/ui/swiper'
  import { useSwiperStyles } from '@/composables/ui/useSwiperStyles'

  useSwiperStyles()

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

  const modules = [Pagination, Autoplay, Navigation]
</script>

<template>
  <section class="relative w-full">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="true"
      :pagination="{ clickable: true, el: '#swiper-pagination-banner' }"
      :navigation="{
        prevEl: '#swiper-button-prev-banner',
        nextEl: '#swiper-button-next-banner',
      }"
      class="h-72 w-full rounded-lg"
    >
      <swiper-slide v-for="slide in props.slides" :key="slide.id">
        <div class="relative h-full w-full overflow-hidden rounded-lg">
          <!-- Background Image -->
          <Image
            v-if="slide.image"
            :src="slide.image"
            :alt="slide.title"
            loading-strategy="none"
            container-class="absolute inset-0 size-full"
          />

          <!-- Overlay gradient -->
          <div class="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent" />

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
      </swiper-slide>
    </swiper>

    <!-- Custom Navigation Buttons -->
    <IconButton
      id="swiper-button-prev-banner"
      variant="primary"
      size="md"
      class="absolute top-1/2 left-2 z-10 -translate-y-1/2"
      title="Previous slide"
    >
      <ChevronLeft />
    </IconButton>
    <IconButton
      id="swiper-button-next-banner"
      variant="primary"
      size="md"
      class="absolute top-1/2 right-2 z-10 -translate-y-1/2"
      title="Next slide"
    >
      <ChevronRight />
    </IconButton>

    <!-- Pagination -->
    <SwiperPagination id="swiper-pagination-banner" variant="small" class="mt-2" />
  </section>
</template>
