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
    FaqListSection,
  } from '@/components/home'

  definePage({
    meta: {
      title: 'Home',
    },
  })
</script>

<template>
  <WinnersSection />
  <FaqListSection />
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
