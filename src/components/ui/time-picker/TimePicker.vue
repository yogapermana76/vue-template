<script setup lang="ts">
  import { computed, ref, watch, nextTick } from 'vue'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

  export interface TimePickerProps {
    /** Time value (v-model) - format: 'HH:mm' */
    modelValue?: string
    /** Use 24-hour format (default: true) */
    use24Hour?: boolean
    /** Minute step increment (default: 15) */
    minuteStep?: number
    /** Popover side positioning */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
    /** Open state (for controlled mode) */
    open?: boolean
  }

  const props = withDefaults(defineProps<TimePickerProps>(), {
    use24Hour: true,
    minuteStep: 15,
    side: 'bottom',
    align: 'start',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    'update:open': [value: boolean]
    save: [value: string]
  }>()

  const internalOpen = ref(false)
  const hourScrollRef = ref<HTMLDivElement | null>(null)
  const minuteScrollRef = ref<HTMLDivElement | null>(null)
  const selectedHour = ref<number>(9)
  const selectedMinute = ref<number>(0)

  // Computed open state (controlled or uncontrolled)
  const isOpen = computed({
    get: () => props.open ?? internalOpen.value,
    set: value => {
      internalOpen.value = value
      emit('update:open', value)
    },
  })

  // Format time as HH:mm string
  const formatTime = () =>
    `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`

  // Parse modelValue to selectedHour and selectedMinute
  watch(
    () => props.modelValue,
    value => {
      if (!value) return

      const [hours, minutes] = value.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        selectedHour.value = hours
        selectedMinute.value = minutes
      }
    },
    { immediate: true },
  )

  // Generate hours array
  const hours = computed(() => {
    const maxHours = props.use24Hour ? 24 : 12
    return Array.from({ length: maxHours }, (_, i) => {
      const hour = props.use24Hour ? i : i + 1
      return {
        value: hour,
        label: String(hour).padStart(2, '0'),
      }
    })
  })

  // Generate minutes array based on step
  const minutes = computed(() => {
    const steps = Math.floor(60 / props.minuteStep)
    return Array.from({ length: steps }, (_, i) => {
      const minute = i * props.minuteStep
      return {
        value: minute,
        label: String(minute).padStart(2, '0'),
      }
    })
  })

  // Scroll to center item (like ScrollablePillTabs)
  const scrollToCenter = (container: HTMLDivElement, selectedButton: HTMLElement) => {
    const containerRect = container.getBoundingClientRect()
    const itemRect = selectedButton.getBoundingClientRect()

    // Calculate item position relative to container's current scroll
    const itemRelativeTop = itemRect.top - containerRect.top + container.scrollTop
    const itemCenter = itemRelativeTop + itemRect.height / 2

    // Target: center item di viewport
    const scrollTarget = Math.max(0, itemCenter - containerRect.height / 2)

    container.scrollTo({ top: scrollTarget, behavior: 'smooth' })
  }

  // Scroll to selected button in specified container
  const scrollToSelected = (containerRef: HTMLDivElement) => {
    const selectedButton = containerRef.querySelector('[data-selected="true"]') as HTMLElement
    if (selectedButton) {
      scrollToCenter(containerRef, selectedButton)
    }
  }

  // Handle time selection with auto-scroll to center
  const handleTimeSelect = (type: 'hour' | 'minute', value: number) => {
    if (type === 'hour') {
      selectedHour.value = value
    } else {
      selectedMinute.value = value
    }

    emit('update:modelValue', formatTime())

    // Auto-scroll to center after selection
    nextTick(() => {
      const containerRef = type === 'hour' ? hourScrollRef.value : minuteScrollRef.value
      if (containerRef) scrollToSelected(containerRef)
    })
  }

  // Handle save and close
  const handleSave = () => {
    emit('save', formatTime())
    isOpen.value = false
  }

  // Scroll to selected values when opened
  watch(isOpen, open => {
    if (open) {
      nextTick(() => {
        if (hourScrollRef.value) scrollToSelected(hourScrollRef.value)
        if (minuteScrollRef.value) scrollToSelected(minuteScrollRef.value)
      })
    }
  })

  // Expose for parent components
  defineExpose({
    selectedHour,
    selectedMinute,
  })
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <slot :selected-hour="selectedHour" :selected-minute="selectedMinute" />
    </PopoverTrigger>

    <PopoverContent
      :class="cn('w-auto overflow-hidden rounded-sm p-0')"
      :align="align"
      :side="side"
    >
      <!-- Selection Zone (Shows current selected time) -->
      <div
        class="from-primary-50 flex items-center justify-center gap-1 bg-linear-to-b to-white px-2 py-2"
      >
        <div
          class="bg-primary-100 text-primary-900 flex size-8 items-center justify-center rounded-sm text-sm font-semibold"
        >
          {{ String(selectedHour).padStart(2, '0') }}
        </div>
        <div class="text-base font-bold text-neutral-400">:</div>
        <div
          class="bg-primary-100 text-primary-900 flex size-8 items-center justify-center rounded-sm text-sm font-semibold"
        >
          {{ String(selectedMinute).padStart(2, '0') }}
        </div>
      </div>

      <!-- Time Selection Container -->
      <div class="flex bg-white">
        <!-- Hours Column -->
        <div>
          <div
            ref="hourScrollRef"
            class="flex max-h-40 flex-col overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Button
              v-for="hour in hours"
              :key="hour.value"
              type="button"
              :data-selected="selectedHour === hour.value"
              :variant="selectedHour === hour.value ? 'primary' : 'tertiary'"
              size="xs"
              layout="iconOnly"
              class="h-8 w-12 shrink-0 rounded-none p-0 text-xs font-normal"
              @click="handleTimeSelect('hour', hour.value)"
            >
              {{ hour.label }}
            </Button>
          </div>
        </div>

        <!-- Minutes Column -->
        <div class="border-l border-neutral-100">
          <div
            ref="minuteScrollRef"
            class="flex max-h-40 flex-col overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Button
              v-for="minute in minutes"
              :key="minute.value"
              type="button"
              :data-selected="selectedMinute === minute.value"
              :variant="selectedMinute === minute.value ? 'primary' : 'tertiary'"
              size="xs"
              layout="iconOnly"
              class="h-8 w-12 shrink-0 rounded-none p-0 text-xs font-normal"
              @click="handleTimeSelect('minute', minute.value)"
            >
              {{ minute.label }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Save Button Footer -->
      <div class="bg-neutral-50 p-2">
        <Button
          type="button"
          variant="primary"
          size="xs"
          class="h-7 w-full rounded-sm text-xs"
          @click="handleSave"
        >
          Simpan
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
