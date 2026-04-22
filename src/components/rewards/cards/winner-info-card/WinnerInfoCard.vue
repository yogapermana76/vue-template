<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { ArrowRight } from 'lucide-vue-next'
  import TrophyIllustration from '@/assets/illustrations/trophy.svg?component'
  import { cn } from '@/utils/cn'
  import ellipseLightImg from '@/assets/vectors/ellipse-lightning.png'
  import lightningGlowSmImg from '@/assets/vectors/lightning-glow-sm.png'

  export interface WinnerInfoCardProps {
    /** Card title */
    title?: string
    /** Card description */
    description?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<WinnerInfoCardProps>(), {
    title: 'Informasi Pemenang',
    description: 'Undian periode Januari - Maret',
  })

  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = () => {
    emit('click')
  }
</script>

<template>
  <button
    :class="
      cn(
        'relative flex h-16 w-full items-center gap-3 overflow-hidden rounded-sm bg-[linear-gradient(135deg,#1AB6BE_0%,#0E6AA7_100%)] px-4',
        props.class,
      )
    "
    @click="handleClick"
  >
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Decorative circle left -->
      <div class="pointer-events-none absolute top-1/2 -left-18 -translate-y-1/2">
        <img :src="ellipseLightImg" alt="" />
      </div>

      <!-- Decorative PLN lightning bolts right -->
      <div class="pointer-events-none absolute top-1/2 right-3 -translate-y-[40%]">
        <img :src="lightningGlowSmImg" alt="" />
      </div>

      <!-- Yellow glow effect top right -->
      <div
        class="absolute -top-22.5 right-10.75 size-49.25 rounded-full bg-[#F4F07A] opacity-30 blur-3xl"
      />
    </div>

    <!-- Trophy Icon -->
    <div class="relative z-10 flex size-12 shrink-0 items-center justify-center">
      <TrophyIllustration class="size-12" />
    </div>

    <!-- Content -->
    <div class="relative z-10 ml-3 flex flex-1 flex-col items-start gap-0.5">
      <h3 class="body-m-semibold line-clamp-1 text-white">{{ title }}</h3>
      <p class="body-caption text-white/80">{{ description }}</p>
    </div>

    <!-- Arrow Icon  -->
    <ArrowRight class="size-4 text-white" />
  </button>
</template>
