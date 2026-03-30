<script setup lang="ts">
  import { useCarouselState } from '@/composables/useCarouselState'
  import { Star, Quote } from 'lucide-vue-next'
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselIndicators,
  } from '@/components/ui/carousel'
  import { Card, CardContent } from '@/components/ui/card'

  interface Testimonial {
    id: number
    name: string
    role: string
    content: string
    rating: number
    avatar?: string
  }

  interface Props {
    testimonials?: Testimonial[]
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'What Customers Say',
    testimonials: () => [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Product Manager',
        content:
          'This template saved us weeks of development time. The components are well-structured and easy to customize.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Designer',
        content:
          'The UI components are beautiful and follow modern design principles. Perfect for our project!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      {
        id: 3,
        name: 'Emma Davis',
        role: 'Developer',
        content:
          'Great documentation and TypeScript support. Integrating this into our Vue 3 app was a breeze.',
        rating: 4,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      },
      {
        id: 4,
        name: 'James Wilson',
        role: 'Startup Founder',
        content:
          'The performance is excellent and the customization options are endless. Highly recommended!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      },
    ],
  })

  // Use composable for carousel state synchronization
  // carouselRef is used in template via ref="carouselRef" binding
  const { carouselRef, currentIndex, handleDotClick } = useCarouselState()

  // Ensure TypeScript recognizes carouselRef is used (referenced in template)
  void carouselRef
</script>

<template>
  <section class="bg-muted/30 py-12 md:py-16">
    <div class="mx-auto max-w-6xl px-4">
      <!-- Section Header -->
      <div class="mb-8 text-center md:mb-12">
        <h2 class="mb-2 text-2xl font-bold md:text-3xl">{{ props.title }}</h2>
        <p class="text-muted-foreground text-sm md:text-base">
          Hear from our satisfied customers and community members
        </p>
      </div>

      <!-- Carousel -->
      <Carousel ref="carouselRef" :autoplay="true" :autoplay-delay="6000" class="mx-auto max-w-4xl">
        <CarouselContent gap="gap-6">
          <CarouselItem
            v-for="testimonial in props.testimonials"
            :key="testimonial.id"
            basis="full"
          >
            <Card class="h-full">
              <CardContent class="flex flex-col p-6 md:p-8">
                <!-- Quote Icon -->
                <Quote class="text-primary mb-4 size-8" />

                <!-- Rating -->
                <div class="mb-4 flex gap-1">
                  <Star
                    v-for="n in testimonial.rating"
                    :key="`star-${n}`"
                    class="size-4 fill-yellow-400 text-yellow-400"
                  />
                </div>

                <!-- Content -->
                <p class="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed md:text-base">
                  "{{ testimonial.content }}"
                </p>

                <!-- Author -->
                <div class="flex items-center gap-4">
                  <img
                    v-if="testimonial.avatar"
                    :src="testimonial.avatar"
                    :alt="testimonial.name"
                    class="size-12 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <p class="font-semibold">{{ testimonial.name }}</p>
                    <p class="text-muted-foreground text-xs md:text-sm">{{ testimonial.role }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>

        <!-- Indicators -->
        <CarouselIndicators
          :total="props.testimonials.length"
          :selected="currentIndex"
          position-class="bottom-4"
          @dot-click="handleDotClick"
        />
      </Carousel>
    </div>
  </section>
</template>
