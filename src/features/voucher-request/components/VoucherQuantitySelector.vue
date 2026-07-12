<script setup lang="ts">
  import { computed } from 'vue'
  import { IconButton } from '@/components/ui/button'
  import { Minus, Plus } from 'lucide-vue-next'

  const LOW_QUOTA_THRESHOLD = 10
  const MEDIUM_QUOTA_THRESHOLD = 20

  const props = defineProps<{
    label: string
    modelValue: number
    /** Remaining quota. Row locks to a "Habis" state when this is 0. */
    quota?: number
    /** Optional absolute cap on top of the remaining quota. */
    max?: number
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const isSoldOut = computed(() => props.quota !== undefined && props.quota <= 0)

  const ceiling = computed(() => {
    const values: number[] = []
    if (props.max !== undefined) values.push(props.max)
    if (props.quota !== undefined) values.push(props.quota)
    return values.length > 0 ? Math.min(...values) : Number.POSITIVE_INFINITY
  })

  const canDecrement = computed(() => !props.disabled && !isSoldOut.value && props.modelValue > 0)
  const canIncrement = computed(
    () => !props.disabled && !isSoldOut.value && props.modelValue < ceiling.value,
  )

  // Warn (yellow) when getting scarce; escalate to error (red) when critically low.
  const quotaClass = computed(() => {
    if (props.quota === undefined) return 'text-slate-500'
    if (props.quota <= LOW_QUOTA_THRESHOLD) return 'text-error-600'
    if (props.quota <= MEDIUM_QUOTA_THRESHOLD) return 'text-warning-700'
    return 'text-slate-500'
  })

  const decrement = () => {
    if (!canDecrement.value) return
    emit('update:modelValue', props.modelValue - 1)
  }

  const increment = () => {
    if (!canIncrement.value) return
    emit('update:modelValue', props.modelValue + 1)
  }
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between gap-3 rounded-md border bg-white px-4 py-2.5 transition-colors',
      isSoldOut ? 'border-slate-200' : 'hover:border-primary-200 border-slate-200',
    ]"
  >
    <div class="flex min-w-0 flex-col">
      <span class="body-m-medium text-slate-800">{{ label }}</span>
      <span v-if="quota !== undefined && !isSoldOut" :class="['body-caption', quotaClass]">
        Sisa {{ quota }}
      </span>
    </div>

    <span
      v-if="isSoldOut"
      class="text-error-600 body-caption-medium inline-flex items-center gap-1.5"
    >
      <span class="bg-error-600 size-1.5 rounded-full" aria-hidden="true" />
      Habis
    </span>

    <div v-else class="flex items-center gap-3">
      <IconButton
        variant="tertiary"
        size="sm"
        class="rounded-full!"
        aria-label="Kurangi"
        :disabled="!canDecrement"
        @click="decrement"
      >
        <Minus class="size-4 text-slate-600" />
      </IconButton>

      <span class="body-m-semibold w-6 text-center text-slate-900 tabular-nums">
        {{ modelValue }}
      </span>

      <IconButton
        variant="tertiary"
        size="sm"
        class="rounded-full!"
        aria-label="Tambah"
        :disabled="!canIncrement"
        @click="increment"
      >
        <Plus class="size-4 text-slate-600" />
      </IconButton>
    </div>
  </div>
</template>
