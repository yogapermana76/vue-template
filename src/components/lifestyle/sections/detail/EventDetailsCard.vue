<script setup lang="ts">
  import type { Component, FunctionalComponent } from 'vue'
  import { Star, CalendarDays, MapPin, type LucideProps } from 'lucide-vue-next'

  type IconComponent = Component | FunctionalComponent<LucideProps>

  export interface EventDetailItem {
    id: string
    icon?: IconComponent
    label: string
    value?: string
    useSlot?: boolean
  }

  interface Props {
    items: EventDetailItem[]
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    class: '',
  })

  const defaultIcons: Record<string, IconComponent> = {
    type: Star,
    date: CalendarDays,
    location: MapPin,
  }

  function getIcon(item: EventDetailItem): IconComponent {
    if (item.icon) return item.icon
    return defaultIcons[item.id] || Star
  }
</script>

<template>
  <div :class="['bg-primary-50 flex flex-col items-start gap-4 rounded-sm p-3', props.class]">
    <div v-for="item in items" :key="item.id" class="flex w-full items-start gap-2">
      <!-- Icon -->
      <component :is="getIcon(item)" class="text-primary-600 size-5 shrink-0" :stroke-width="2" />

      <!-- Text Container -->
      <div class="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <!-- Label -->
        <span class="body-small text-slate-800/75">
          {{ item.label }}
        </span>

        <!-- Value: Slot or String -->
        <slot v-if="item.useSlot" :name="`${item.id}-value`" :item="item">
          <!-- Default fallback if slot not provided -->
          <span class="body-m text-slate-950">-</span>
        </slot>
        <span v-else :class="['text-slate-950', item.id === 'type' ? 'body-m-semibold' : 'body-m']">
          {{ item.value || '-' }}
        </span>
      </div>
    </div>
  </div>
</template>
