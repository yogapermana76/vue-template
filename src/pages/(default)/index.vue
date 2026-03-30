<script setup lang="ts">
  import {
    HeroSection,
    FeaturesSection,
    TechStackSection,
    QuickActionsSection,
    CTASection,
    FeaturedBannerCarousel,
    RecommendedProductsCarousel,
    TestimonialCarousel,
  } from '@/components/home'

  definePage({
    meta: {
      title: 'Home',
    },
  })
</script>

<template>
  <HeroSection />
  <FeaturedBannerCarousel />
  <FeaturesSection />
  <RecommendedProductsCarousel />
  <TechStackSection />
  <TestimonialCarousel />
  <QuickActionsSection />
  <CTASection />
</template>
