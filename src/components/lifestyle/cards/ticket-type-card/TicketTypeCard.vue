<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { Check, CheckCircle2, ChevronDown } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

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
    /** Whether the ticket is selectable (shows radio button) */
    selectable?: boolean
    /** Value for radio button */
    value?: string
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
    return props.selected ? 'border-[1.5px] border-primary-500' : 'border-[1.5px] border-slate-100'
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

  const titleFontClass = computed(() => {
    return 'body-l font-bold'
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
        'relative flex w-full max-w-82 flex-col gap-2 rounded-sm pt-3 pb-0 transition-all',
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
      <h3 :class="cn(titleFontClass, 'flex-1', titleColorClass)">
        {{ title }}
      </h3>

      <!-- Radio Button Indicator -->
      <div v-if="selectable" class="shrink-0">
        <!-- Selected State: CheckCircle2 -->
        <CheckCircle2
          v-if="selected"
          class="text-success-600 fill-success-100 size-4"
          aria-label="Selected"
        />
        <!-- Unselected State: Empty Circle -->
        <div
          v-else
          class="size-4 rounded-full border border-slate-200 bg-slate-100"
          aria-label="Not selected"
        />
      </div>
    </div>

    <!-- Content Card -->
    <div
      :class="
        cn(
          'flex w-full flex-col items-center justify-center gap-0.5 self-stretch rounded-b-sm px-0 py-2',
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
              <Check class="text-primary-600 size-4 shrink-0" :stroke-width="4" />
              <!-- Feature Text -->
              <span class="body-caption-semibold text-slate-950">
                {{ feature.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detail Link -->
        <Button
          v-if="detailText"
          variant="tertiary"
          size="xs"
          class="h-auto w-fit items-center gap-0.5 p-0"
          :class="
            selected
              ? 'body-caption-medium text-primary-700'
              : 'body-caption-semibold text-primary-700'
          "
          @click="handleDetailClick"
        >
          <span>{{ detailText }}</span>
          <ChevronDown class="size-3 -rotate-90" />
        </Button>
      </div>
    </div>
  </div>
</template>
