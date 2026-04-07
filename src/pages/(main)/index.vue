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
    PreferencesSection,
    WinnersSection,
  } from '@/components/home'

  definePage({
    meta: {
      title: 'Home',
    },
  })
</script>

<template>
  <WinnersSection />
  <HeroSection />
  <FeaturedBannerCarousel />
  <FeaturesSection />
  <RecommendedProductsCarousel />
  <PreferencesSection />
  <TechStackSection />
  <TestimonialCarousel />
  <QuickActionsSection />
  <FAQSection />
  <CTASection />
</template>
