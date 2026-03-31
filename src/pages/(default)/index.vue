<script setup lang="ts">
  import {
    HeroSection,
    FeaturesSection,
    TechStackSection,
    QuickActionsSection,
    CTASection,
    FAQSection,
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
  <FAQSection />
  <CTASection />
</template>
