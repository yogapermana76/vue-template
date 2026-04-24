<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { Check, CheckCircle2, ChevronDown } from 'lucide-vue-next'

  export interface TicketTypeCardFeature {
    /** Feature text */
    text: string
  }

  export interface TicketTypeCardProps {
    /** Ticket type title (e.g., "Reguler", "VIP") */
    title: string
    /** Ticket features/inclusions list */
    features: TicketTypeCardFeature[]
    /** Subtitle/description (e.g., "Apa yang didapatkan:") */
    subtitle?: string
    /** Detail link text */
    detailText?: string
    /** Whether the ticket is selected */
    selected?: boolean
    /** Whether the ticket is selectable (shows checkbox) */
    selectable?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<TicketTypeCardProps>(), {
    subtitle: 'Apa yang didapatkan:',
    detailText: 'Lihat Detail',
    selected: false,
    selectable: true,
  })

  const emit = defineEmits<{
    /** Emitted when the card is clicked */
    click: []
    /** Emitted when the detail link is clicked */
    detail: []
  }>()

  const cardBorderClass = computed(() => {
    return props.selected ? 'border-primary-500' : 'border-slate-100'
  })

  const cardBackgroundClass = computed(() => {
    return props.selected ? 'bg-slate-50' : 'bg-white'
  })

  const contentBackgroundClass = computed(() => {
    return props.selected ? 'bg-primary-50' : 'bg-neutral-50'
  })

  const titleColorClass = computed(() => {
    return props.selected ? 'text-primary-600' : 'text-slate-950'
  })

  const handleCardClick = () => {
    if (props.selectable) {
      emit('click')
    }
  }

  const handleDetailClick = (event: Event) => {
    event.stopPropagation()
    emit('detail')
  }
</script>

<template>
  <div
    data-slot="ticket-type-card"
    :class="
      cn(
        'border-1.5 relative flex w-full max-w-82 flex-col gap-2 rounded-xl pt-3 pb-0 transition-all',
        cardBorderClass,
        cardBackgroundClass,
        selectable && 'cursor-pointer hover:shadow-sm',
        props.class,
      )
    "
    @click="handleCardClick"
  >
    <!-- Header Section -->
    <div class="flex w-full items-center gap-2 px-3">
      <!-- Title -->
      <h3 :class="cn('body-l-semibold flex-1', titleColorClass)">
        {{ title }}
      </h3>

      <!-- Selected Checkmark Icon -->
      <CheckCircle2
        v-if="selected"
        class="text-success-600 fill-success-100 size-4 shrink-0"
        aria-label="Selected"
      />

      <!-- Unselected Checkbox -->
      <div
        v-else-if="selectable"
        class="size-4 shrink-0 rounded-full border border-slate-200 bg-slate-100"
        aria-label="Not selected"
      />
    </div>

    <!-- Content Card -->
    <div
      :class="
        cn(
          'flex w-full flex-col items-center justify-center gap-0.5 self-stretch rounded-b-xl px-0 py-2',
          contentBackgroundClass,
        )
      "
    >
      <!-- Information Section -->
      <div class="flex w-full flex-col gap-3 px-3">
        <!-- Features List -->
        <div class="flex flex-col gap-1">
          <!-- Subtitle -->
          <p class="body-caption text-slate-950">{{ subtitle }}</p>

          <!-- Features -->
          <div class="flex flex-col gap-1">
            <div v-for="(feature, index) in features" :key="index" class="flex items-center gap-1">
              <!-- Checkmark Icon -->
              <Check class="text-primary-600 size-4 shrink-0" />
              <!-- Feature Text -->
              <span class="body-caption-medium flex-1 text-slate-900">
                {{ feature.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detail Link -->
        <button
          v-if="detailText"
          type="button"
          class="body-caption-semibold text-primary-700 flex w-fit items-center gap-0.5 transition-opacity hover:opacity-80"
          @click="handleDetailClick"
        >
          <span>{{ detailText }}</span>
          <ChevronDown class="size-3 rotate-[-90deg]" />
        </button>
      </div>
    </div>
  </div>
</template>
