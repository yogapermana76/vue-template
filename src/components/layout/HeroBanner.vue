<script setup lang="ts">
  import { CurvedEdge, Image } from '@/components/ui'

  interface HeroBannerProps {
    src?: string
    alt?: string
    showCurvedEdge?: boolean
  }

  withDefaults(defineProps<HeroBannerProps>(), {
    src: 'https://picsum.photos/375/187',
    alt: 'Banner',
    showCurvedEdge: true,
  })
</script>

<template>
  <div class="relative h-46.75 w-full">
    <Image :src="src" :alt="alt" container-class="h-full w-full" />
    <!-- Rounded Overlap Shape -->
    <CurvedEdge v-if="showCurvedEdge" />
  </div>
</template>
