<script setup lang="ts">
  import { RoundedOverlap, Image } from '@/components/ui'

  interface HeroBannerProps {
    src?: string
    alt?: string
    showRoundedOverlap?: boolean
  }

  withDefaults(defineProps<HeroBannerProps>(), {
    src: 'https://picsum.photos/375/187',
    alt: 'Banner',
    showRoundedOverlap: true,
  })
</script>

<template>
  <div class="relative h-46.75 w-full">
    <Image :src="src" :alt="alt" container-class="h-full w-full" />
    <!-- Rounded Overlap Shape -->
    <RoundedOverlap v-if="showRoundedOverlap" />
  </div>
</template>
