<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'

  export interface DatePickerCardProps {
    /** Day of week (e.g., 'Kamis', 'Sabtu') */
    dayName: string
    /** Date number (e.g., 23, 25) */
    date: number
    /** Month name (e.g., 'MEI', 'JUN') */
    month: string
    /** Year (e.g., 2026) */
    year: number
    /** Whether this date is selected */
    selected?: boolean
    /** Whether this date is available/has stock */
    available?: boolean
    /** Status label for unavailable dates */
    statusLabel?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
    /** Click handler */
    onClick?: () => void
  }

  const props = withDefaults(defineProps<DatePickerCardProps>(), {
    selected: false,
    available: true,
    statusLabel: 'Habis',
  })

  /**
   * Computed classes based on state
   * Using design system colors from main.css
   */
  const cardClasses = computed(() => {
    if (!props.available) {
      return 'bg-slate-100 border-slate-200'
    }
    if (props.selected) {
      return 'border-transparent shadow-[2px_2px_12px_rgba(0,162,185,0.12)]'
    }
    return 'bg-white border-slate-200 hover:border-slate-300'
  })

  const cardStyle = computed(() => {
    if (props.selected && props.available) {
      return {
        background: 'linear-gradient(180deg, #3D8BA8 0%, #2A7A9E 50%, #1D6B8F 100%)',
      }
    }
    return undefined
  })

  const dayNameClasses = computed(() => {
    if (!props.available) {
      return 'text-slate-600/75'
    }
    if (props.selected) {
      return 'text-white'
    }
    return 'text-slate-950'
  })

  const dateClasses = computed(() => {
    if (!props.available) {
      return 'text-slate-600/75'
    }
    if (props.selected) {
      return 'text-white'
    }
    return 'text-slate-950'
  })

  const metaTextClasses = computed(() => {
    if (!props.available) {
      return 'text-slate-600/75'
    }
    if (props.selected) {
      return 'text-slate-50/75'
    }
    return 'text-slate-600/75'
  })

  const dotClasses = computed(() => {
    if (props.selected) {
      return 'bg-slate-100'
    }
    return 'bg-slate-200'
  })

  const statusLabelClasses = computed(() => {
    return 'text-sky-700'
  })
</script>

<template>
  <button
    :class="
      cn(
        'flex h-19.5 w-19.5 flex-col items-center justify-center gap-1 rounded-sm border p-2 px-3 transition-colors',
        cardClasses,
        props.class,
      )
    "
    :style="cardStyle"
    :disabled="!available"
    @click="onClick"
  >
    <!-- Day Name -->
    <span
      :class="
        cn('body-caption-semibold', selected ? '' : available ? '' : 'font-normal', dayNameClasses)
      "
    >
      {{ dayName }}
    </span>

    <!-- Date Number -->
    <span :class="cn('body-l-semibold', dateClasses)">
      {{ date }}
    </span>

    <!-- Month, Year, or Status -->
    <div v-if="available" class="flex items-center justify-center gap-1">
      <!-- Month -->
      <span :class="cn('body-small', metaTextClasses)">
        {{ month }}
      </span>

      <!-- Dot Separator -->
      <div :class="cn('h-0.5 w-0.5 rounded-full', dotClasses)" />

      <!-- Year -->
      <span :class="cn('body-small', metaTextClasses)">
        {{ year }}
      </span>
    </div>

    <!-- Status Label for unavailable dates -->
    <span v-else :class="cn('body-caption-semibold', statusLabelClasses)">
      {{ statusLabel }}
    </span>
  </button>
</template>
