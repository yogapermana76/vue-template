<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { Gift } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import {
    winnerCardVariants,
    winnerCardHeaderTextVariants,
    type WinnerCardVariants,
  } from './winnerCardVariants'
  import Rank1Icon from '@/assets/icons/rank-1.svg?component'
  import Rank2Icon from '@/assets/icons/rank-2.svg?component'
  import Rank3Icon from '@/assets/icons/rank-3.svg?component'

  export interface WinnerData {
    name: string
    email?: string
    phone?: string
    customFields?: Array<{ label?: string; value: string }>
  }

  export interface Props {
    rank: number
    rankLabel?: string
    prize: string
    winner: WinnerData
    prizeImage?: string
    prizeImageAlt?: string
    variant?: WinnerCardVariants['variant']
    showRankIcon?: boolean
    customRankIcon?: Component
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    showRankIcon: true,
  })

  const isFeatured = computed(() => {
    if (props.variant) return props.variant === 'featured'
    return props.rank <= 3
  })

  const computedVariant = computed(() => (isFeatured.value ? 'featured' : 'default'))

  const rankIcon = computed(() => {
    if (props.customRankIcon) return props.customRankIcon
    if (!props.showRankIcon || props.rank > 3) return null
    const iconMap: Record<number, Component> = { 1: Rank1Icon, 2: Rank2Icon, 3: Rank3Icon }
    return iconMap[props.rank] || null
  })

  const displayRankLabel = computed(() => props.rankLabel || `Peringkat ${props.rank}`)
</script>

<template>
  <div
    data-slot="winner-card"
    :class="cn(winnerCardVariants({ variant: computedVariant }), props.class)"
  >
    <!-- Header -->
    <div class="flex w-full flex-row items-center justify-between px-3 pt-2 pb-1">
      <!-- Rank Title -->
      <div class="flex flex-row items-center gap-1">
        <component
          v-if="rankIcon"
          :is="rankIcon"
          :class="isFeatured ? 'size-4 shrink-0' : 'size-3 shrink-0'"
        />
        <span :class="winnerCardHeaderTextVariants({ variant: computedVariant })">
          {{ displayRankLabel }}
        </span>
      </div>

      <!-- Prize Title -->
      <div
        :class="
          cn(
            'flex flex-row items-center gap-1',
            winnerCardHeaderTextVariants({ variant: computedVariant }),
          )
        "
      >
        <Gift class="shrink-0" :size="isFeatured ? 14 : 12" />
        <span class="truncate">{{ prize }}</span>
      </div>
    </div>

    <!-- Content Container -->
    <div class="flex w-full flex-row items-center justify-between rounded-sm bg-white p-3">
      <!-- Winner Info -->
      <div class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span class="body-m-semibold w-full truncate text-slate-950">
          {{ winner.name }}
        </span>
        <span v-if="winner.email" class="body-caption w-full truncate text-slate-500">
          {{ winner.email }}
        </span>
        <span v-if="winner.phone" class="body-caption w-full truncate text-slate-500">
          {{ winner.phone }}
        </span>
        <span
          v-for="(field, index) in winner.customFields"
          :key="index"
          class="body-caption w-full truncate text-slate-500"
        >
          <template v-if="field.label">{{ field.label }}: </template>{{ field.value }}
        </span>
      </div>

      <!-- Prize Image -->
      <div class="ml-3 size-14 shrink-0 overflow-hidden rounded-xs bg-slate-200">
        <img
          v-if="prizeImage"
          :src="prizeImage"
          :alt="prizeImageAlt || prize"
          class="size-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
