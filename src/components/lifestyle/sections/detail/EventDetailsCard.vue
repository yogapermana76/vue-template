<script setup lang="ts">
  import type { Component, FunctionalComponent } from 'vue'
  import { Star, CalendarDays, MapPin, ChevronDown, type LucideProps } from 'lucide-vue-next'

  type IconComponent = Component | FunctionalComponent<LucideProps>

  export interface EventDetailItem {
    id: string
    icon?: IconComponent
    label: string
    value: string
    secondaryValue?: string
    actionText?: string
    actionHandler?: () => void
    showChevron?: boolean
    onChevronClick?: () => void
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

        <!-- Value Container -->
        <div class="flex w-full items-center gap-0.5">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <!-- Primary Value -->
            <span :class="['text-slate-950', item.id === 'type' ? 'body-m-semibold' : 'body-m']">
              {{ item.value }}
            </span>

            <!-- Secondary Value (e.g., time or address) -->
            <span v-if="item.secondaryValue" class="body-caption text-slate-950">
              {{ item.secondaryValue }}
            </span>

            <!-- Action Button (e.g., Lihat Peta) -->
            <button
              v-if="item.actionText"
              type="button"
              class="body-caption-semibold text-primary-700 w-fit"
              @click="item.actionHandler"
            >
              {{ item.actionText }}
            </button>
          </div>

          <!-- Chevron (optional, for expandable items) -->
          <button
            v-if="item.showChevron"
            type="button"
            class="shrink-0 p-1"
            @click="item.onChevronClick"
          >
            <ChevronDown class="size-4 text-slate-950" :stroke-width="2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
