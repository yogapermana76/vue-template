<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { Image } from '@/components/ui/image'
  import { AppCopyrightFooter } from '@/components/shared'
  import { LoginCarousel } from '@/features/auth'
  import plnLogo from '@/assets/images/pln-mobile-logo.png'

  definePage({
    path: '/auth',
    redirect: '/login',
  })
</script>

<template>
  <div class="flex min-h-screen bg-slate-950">
    <div class="relative hidden overflow-hidden lg:flex lg:w-[52%]">
      <LoginCarousel />

      <!-- Fixed branding pill in top-left, floats above the carousel. -->
      <div class="pointer-events-none absolute top-14 left-14 z-20 flex items-center gap-3">
        <Image
          :src="plnLogo"
          alt="PLN Mobile"
          loading-strategy="skeleton"
          aspect-ratio="square"
          container-class="size-9 shrink-0"
        />
        <span class="body-l-semibold tracking-wide text-white/95 drop-shadow-md">
          PLN Mobile - Lifestyle
        </span>
      </div>
    </div>

    <div class="relative flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
      <div
        class="absolute top-0 right-0 left-0 h-0.5 bg-linear-to-r from-[#0a7fa5] via-[#0ab5a0] to-transparent"
      />

      <div class="mb-10 flex items-center gap-2.5 lg:hidden">
        <Image
          :src="plnLogo"
          alt="PLN Mobile"
          loading-strategy="skeleton"
          aspect-ratio="square"
          container-class="size-8 shrink-0"
        />
        <span class="body-l-semibold text-foreground">PLN Mobile - Lifestyle</span>
      </div>

      <RouterView />

      <AppCopyrightFooter owner="PLN Mobile" class="mt-10" />
    </div>
  </div>
</template>
