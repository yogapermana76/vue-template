<script setup lang="ts">
  import { computed } from 'vue'
  import type { Component } from 'vue'
  import { Spinner } from '@/components/ui/spinner'
  import { formatCurrency } from '@/utils/currency'
  import { formatCompactNumber, formatCompactRupiah } from '../utils/formatCompact'
  import type { LoketStatCard as LoketStatCardType } from '../types'

  const props = defineProps<{
    card: LoketStatCardType
    value: number | undefined
    loading?: boolean
  }>()

  const displayValue = computed(() => {
    if (props.value === undefined || props.value === null) return '—'
    return props.card.format === 'currency'
      ? formatCompactRupiah(props.value)
      : formatCompactNumber(props.value)
  })

  const preciseValue = computed(() => {
    if (props.value === undefined || props.value === null) return ''
    return props.card.format === 'currency'
      ? formatCurrency(props.value, 'IDR')
      : props.value.toLocaleString('id-ID')
  })

  interface ToneStyle {
    iconBg: string
    iconColor: string
    accent: string
  }
  const TONE_STYLES: Record<string, ToneStyle> = {
    primary: {
      iconBg: 'bg-primary-50 ring-primary-100',
      iconColor: 'text-primary-600',
      accent: 'bg-primary-500',
    },
    success: {
      iconBg: 'bg-success-50 ring-success-100',
      iconColor: 'text-success-600',
      accent: 'bg-success-500',
    },
    warning: {
      iconBg: 'bg-warning-50 ring-warning-100',
      iconColor: 'text-warning-600',
      accent: 'bg-warning-500',
    },
    info: {
      iconBg: 'bg-info-50 ring-info-100',
      iconColor: 'text-info-600',
      accent: 'bg-info-500',
    },
    error: {
      iconBg: 'bg-error-50 ring-error-100',
      iconColor: 'text-error-600',
      accent: 'bg-error-500',
    },
    neutral: {
      iconBg: 'bg-neutral-100 ring-neutral-200',
      iconColor: 'text-neutral-600',
      accent: 'bg-neutral-500',
    },
  }

  const tone = computed(() => TONE_STYLES[props.card.tone] ?? TONE_STYLES.neutral)
  const iconComponent = computed<Component>(() => props.card.icon)
</script>

<template>
  <div
    class="group relative flex items-center gap-3 overflow-hidden rounded-md border border-neutral-200 bg-white p-3 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
  >
    <span
      :class="[
        'flex size-10 shrink-0 items-center justify-center rounded-md ring-1',
        tone.iconBg,
        tone.iconColor,
      ]"
    >
      <component :is="iconComponent" class="size-5" />
    </span>

    <div class="flex min-w-0 flex-1 flex-col leading-tight">
      <p class="body-caption line-clamp-2 font-medium text-neutral-600" :title="card.title">
        {{ card.title }}
      </p>
      <Spinner v-if="loading" size="sm" tone="muted" class="mt-1" />
      <p
        v-else
        class="animate-in fade-in slide-in-from-bottom-0.5 truncate text-xl font-bold tracking-tight text-neutral-950 tabular-nums duration-300"
        :title="preciseValue"
      >
        {{ displayValue }}
      </p>
    </div>

    <div :class="['absolute inset-x-0 bottom-0 h-0.5', tone.accent]" />
  </div>
</template>
