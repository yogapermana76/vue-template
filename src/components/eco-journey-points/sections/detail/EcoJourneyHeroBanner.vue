<script setup lang="ts">
  import { ref } from 'vue'
  import { RoundedOverlap } from '@/components/ui'

  interface Props {
    src?: string
    alt?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    src: 'https://picsum.photos/375/187',
    alt: 'Promo Banner',
  })

  const imageLoading = ref(true)
</script>

<template>
  <div class="relative h-46.75 w-full">
    <div v-if="imageLoading" class="absolute inset-0 h-full w-full animate-pulse bg-neutral-200" />
    <img
      :src="props.src"
      :alt="props.alt"
      class="h-full w-full object-cover"
      :class="{ invisible: imageLoading }"
      @load="imageLoading = false"
      @error="imageLoading = false"
    />
    <!-- Rounded Overlap Shape -->
    <RoundedOverlap />
  </div>
</template>
