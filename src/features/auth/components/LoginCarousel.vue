<script setup lang="ts">
  import { FadeCarousel } from '@/components/ui/swiper'
  import { Image } from '@/components/ui/image'
  import LoginCarouselCaption from './login-carousel/LoginCarouselCaption.vue'
  import LoginCarouselPagination from './login-carousel/LoginCarouselPagination.vue'
  import { LOGIN_CAROUSEL_SLIDES } from './login-carousel/slides'
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <FadeCarousel :slides="LOGIN_CAROUSEL_SLIDES" :autoplay-delay="3500" :allow-touch-move="false">
      <template #slide="{ item }">
        <Image
          :src="item.image"
          :alt="item.title"
          loading-strategy="none"
          :lazy="false"
          container-class="absolute inset-0 h-full w-full"
          class="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/45 to-slate-950/20"
        />
      </template>

      <template #overlay="{ activeIndex, total, goTo }">
        <div class="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-14">
          <div class="relative min-h-38">
            <LoginCarouselCaption
              v-for="(slide, i) in LOGIN_CAROUSEL_SLIDES"
              v-show="activeIndex === i"
              :key="i"
              :index="i"
              :total="total"
              :title="slide.title"
              :description="slide.description"
            />
          </div>

          <LoginCarouselPagination
            :total="total"
            :active-index="activeIndex"
            class="mt-6"
            @select="goTo"
          />
        </div>
      </template>
    </FadeCarousel>
  </div>
</template>
