<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Image } from '@/components/ui'

  export interface RewardPrizeCardProps {
    /** Prize image URL or component */
    image?: string
    /** Prize title */
    title: string
    /** Prize date */
    date: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = defineProps<RewardPrizeCardProps>()
</script>

<template>
  <div
    :class="
      cn('flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3', props.class)
    "
  >
    <!-- Prize Image -->
    <Image v-if="image" :src="image" :alt="title" container-class="size-16 shrink-0 rounded-lg" />

    <!-- Prize Info -->
    <div class="flex flex-1 flex-col gap-1">
      <h3 class="body-l-semibold text-slate-950">{{ title }}</h3>
      <p class="body-m-medium text-primary-600">{{ date }}</p>
    </div>
  </div>
</template>
