<script setup lang="ts">
  import { computed } from 'vue'
  import { AnimatedUnderlineTabs, type AnimatedUnderlineTabItem } from '@/components/ui/tabs'
  import { SUBMISSION_STATUS_META } from '../../constants'
  import type { SubmissionStatus } from '../../types'

  const props = defineProps<{
    modelValue: SubmissionStatus
    order: readonly SubmissionStatus[]
    counts: Record<SubmissionStatus, number>
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: SubmissionStatus]
  }>()

  const items = computed<AnimatedUnderlineTabItem<SubmissionStatus>[]>(() =>
    props.order.map(key => ({
      key,
      label: SUBMISSION_STATUS_META[key].label,
      count: props.counts[key],
      countTone: SUBMISSION_STATUS_META[key].countTone,
    })),
  )
</script>

<template>
  <AnimatedUnderlineTabs
    :items="items"
    :model-value="modelValue"
    @update:model-value="v => emit('update:modelValue', v)"
  />
</template>
