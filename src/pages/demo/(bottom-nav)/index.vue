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
  } from '@/components/demo/home'

  definePage({
    meta: {
      title: 'Home',
    },
  })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <HeroSection />
    <FeaturedBannerCarousel />
    <FeaturesSection />
    <RecommendedProductsCarousel />
    <PreferencesSection />
    <TechStackSection />
    <TestimonialCarousel />
    <QuickActionsSection />
    <FAQSection />
    <FaqListSection />
    <WinnersSection />
    <CTASection />
  </div>
</template>
