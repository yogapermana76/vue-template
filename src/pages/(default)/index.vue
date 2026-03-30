<script setup lang="ts">
  import {
    HeroSection,
    FeaturesSection,
    TechStackSection,
    QuickActionsSection,
    CTASection,
  } from '@/components/home'

  definePage({
    meta: {
      title: 'Home',
    },
  })
</script>

<template>
  <HeroSection />
  <FeaturesSection />
  <TechStackSection />
  <QuickActionsSection />
  <CTASection />
</template>
