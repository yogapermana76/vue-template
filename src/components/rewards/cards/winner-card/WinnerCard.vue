<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { Gift } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import {
    winnerCardVariants,
    winnerCardHeaderVariants,
    winnerCardContentVariants,
    winnerCardHeaderTextVariants,
    winnerCardWinnerNameVariants,
    winnerCardDetailVariants,
    type WinnerCardVariants,
  } from './winnerCardVariants'
  import Rank1Icon from '@/assets/icons/rank-1.svg?component'
  import Rank2Icon from '@/assets/icons/rank-2.svg?component'
  import Rank3Icon from '@/assets/icons/rank-3.svg?component'
  import { Image } from '@/components/ui'

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
    highlightedContent?: boolean
    customRankIcon?: Component
    class?: HTMLAttributes['class']
    contentClass?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    showRankIcon: false,
    highlightedContent: false,
  })

  const isFeatured = computed(() => {
    if (props.variant) return props.variant === 'featured'
    return props.rank <= 3
  })

  // Map to variant: featured ranks use 'featured', highlighted current user uses 'highlighted'
  const computedVariant = computed(() => {
    if (props.highlightedContent && isFeatured.value) {
      return 'highlighted'
    }
    return isFeatured.value ? 'featured' : 'default'
  })

  const rankIcon = computed(() => {
    if (props.customRankIcon) return props.customRankIcon
    if (!props.showRankIcon || props.rank > 3) return null
    const iconMap: Record<number, Component> = { 1: Rank1Icon, 2: Rank2Icon, 3: Rank3Icon }
    return iconMap[props.rank] || null
  })

  const displayRankLabel = computed(() => props.rankLabel || `Peringkat ${props.rank}`)

  const isFeaturedSize = computed(() => isFeatured.value)

  const iconColorClass = computed(() => {
    switch (computedVariant.value) {
      case 'featured':
        return 'text-white'
      case 'highlighted':
        return 'text-white'
      case 'default':
      default:
        return 'text-slate-600'
    }
  })
</script>

<template>
  <div
    data-slot="winner-card"
    :class="cn(winnerCardVariants({ variant: computedVariant }), props.class)"
  >
    <!-- Header -->
    <div :class="winnerCardHeaderVariants({ variant: computedVariant })">
      <!-- Rank Title - Left side -->
      <div class="flex flex-row items-center gap-1">
        <component
          v-if="rankIcon"
          :is="rankIcon"
          :class="cn(isFeaturedSize ? 'size-4 shrink-0' : 'size-3 shrink-0', iconColorClass)"
        />
        <span :class="winnerCardHeaderTextVariants({ variant: computedVariant })">
          {{ displayRankLabel }}
        </span>
      </div>

      <!-- Prize Title - Right side -->
      <div class="flex flex-row items-center justify-end gap-1">
        <Gift :class="cn('shrink-0', iconColorClass)" :size="isFeaturedSize ? 14 : 12" />
        <span :class="cn('truncate', winnerCardHeaderTextVariants({ variant: computedVariant }))">{{
          prize
        }}</span>
      </div>
    </div>

    <!-- Content Container -->
    <div :class="cn(winnerCardContentVariants({ variant: computedVariant }), props.contentClass)">
      <!-- Winner Info -->
      <div class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span :class="winnerCardWinnerNameVariants({ variant: computedVariant })">
          {{ winner.name }}
        </span>
        <span v-if="winner.email" :class="winnerCardDetailVariants({ variant: computedVariant })">
          {{ winner.email }}
        </span>
        <span v-if="winner.phone" :class="winnerCardDetailVariants({ variant: computedVariant })">
          {{ winner.phone }}
        </span>
        <span
          v-for="(field, index) in winner.customFields"
          :key="index"
          :class="winnerCardDetailVariants({ variant: computedVariant })"
        >
          <template v-if="field.label">{{ field.label }}: </template>{{ field.value }}
        </span>
      </div>

      <!-- Prize Image -->
      <Image
        v-if="prizeImage"
        :src="prizeImage"
        :alt="prizeImageAlt || prize"
        container-class="ml-3 size-14 shrink-0 rounded-xs"
      />
    </div>
  </div>
</template>
