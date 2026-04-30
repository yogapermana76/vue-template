<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { parseISO, format } from 'date-fns'
  import { id as idLocale } from 'date-fns/locale'
  import { cn } from '@/utils/cn'
  import lightningGlow from '@/assets/vectors/lightning-glow-md.png'

  export interface DatePickerCardProps {
    /** Date string in any format (ISO, locale, etc.) */
    date: string
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

  const parsedDate = computed(() => parseISO(props.date))

  const dayName = computed(() => format(parsedDate.value, 'EEEE', { locale: idLocale }))
  const dateNumber = computed(() => format(parsedDate.value, 'd'))
  const month = computed(() => format(parsedDate.value, 'MMM', { locale: idLocale }).toUpperCase())
  const year = computed(() => format(parsedDate.value, 'yyyy'))

  /**
   * Computed classes based on state
   * Using design system colors from main.css
   */
  const cardClasses = computed(() => {
    if (!props.available) {
      return 'bg-slate-100 border border-slate-200'
    }
    if (props.selected) {
      return 'bg-gradient-date-selected border-none shadow-[2px_2px_12px_rgba(0,162,185,0.12)]'
    }
    return 'bg-white border border-slate-200 hover:border-slate-300'
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
        'relative flex h-19.5 w-19.5 flex-col items-center justify-center gap-1 overflow-hidden rounded-sm p-2 px-3 transition-colors',
        cardClasses,
        props.class,
      )
    "
    :disabled="!available"
    @click="onClick"
  >
    <!-- Lightning Glow decoration for selected state -->
    <img
      v-if="selected && available"
      :src="lightningGlow"
      alt=""
      class="pointer-events-none absolute -top-16 -right-8 h-34.75 w-21 -rotate-2 opacity-60"
    />

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
      {{ dateNumber }}
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
