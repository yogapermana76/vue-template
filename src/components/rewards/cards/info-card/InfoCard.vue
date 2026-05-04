<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import lightningGlowImg from '@/assets/vectors/lightning-glow-md.png'

  interface Props {
    /**
     * Card title/question text
     */
    title: string
    /**
     * Image URL for the card illustration
     */
    image: string
    /**
     * Additional classes to apply to the card container
     */
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    click: []
  }>()
</script>

<template>
  <div
    :class="
      cn(
        'relative flex h-50 w-36 cursor-pointer flex-col overflow-hidden rounded-sm p-3 transition-transform active:scale-95',
        props.class,
      )
    "
    style="background: linear-gradient(135deg, #4ebec2 0%, #36aeb4 50%, #2d848d 100%)"
    @click="emit('click')"
  >
    <!-- Decorative overlay with diagonal gradient lines -->
    <div
      class="absolute inset-0"
      style="
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.15) 0%,
          transparent 30%,
          rgba(255, 255, 255, 0.08) 60%,
          transparent 100%
        );
      "
    />

    <!-- Additional decorative layer for depth -->
    <div
      class="absolute inset-0 opacity-40"
      style="
        background: linear-gradient(
          -45deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 50%,
          transparent 100%
        );
      "
    />

    <!-- Lightning Glow -->
    <div class="pointer-events-none absolute -top-8 -right-11">
      <img :src="lightningGlowImg" alt="" />
    </div>

    <!-- Title -->
    <h3 class="relative z-10 text-sm leading-5 font-semibold text-white">
      {{ title }}
    </h3>

    <!-- Image Container - positioned at bottom left with spacing -->
    <div class="absolute bottom-3 left-3 z-10 size-20">
      <img :src="image" :alt="title" class="h-full w-full object-contain" />
    </div>
  </div>
</template>
