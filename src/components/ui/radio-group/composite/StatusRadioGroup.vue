<script setup lang="ts">
  /**
   * Boolean-backed status radio (Aktif / Tidak Aktif). Wraps the plain
   * `RadioGroup` primitive so every form that flips an `Active` boolean
   * uses the same label, layout, and required-marker treatment.
   *
   * Two-way binds a `boolean` via `v-model`. Emits `update:modelValue`.
   */
  import { computed } from 'vue'
  import RadioGroup from '../RadioGroup.vue'
  import RadioGroupItem from '../RadioGroupItem.vue'

  const props = withDefaults(
    defineProps<{
      /** Current active state — v-model. */
      modelValue: boolean
      /** Label above the radios. */
      label?: string
      /** Custom copy for the "true" and "false" options. */
      trueLabel?: string
      falseLabel?: string
      /** Unique id prefix so multiple StatusRadioGroups can coexist on one page. */
      idPrefix?: string
      required?: boolean
      disabled?: boolean
    }>(),
    {
      label: 'Status',
      trueLabel: 'Aktif',
      falseLabel: 'Tidak Aktif',
      idPrefix: 'status',
      required: true,
      disabled: false,
    },
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
  }>()

  // Reka RadioGroup only speaks strings, so translate the boolean at the edge.
  const stringValue = computed(() => (props.modelValue ? 'true' : 'false'))
  const onChange = (v: unknown) => emit('update:modelValue', String(v) === 'true')

  const trueId = computed(() => `${props.idPrefix}-active-true`)
  const falseId = computed(() => `${props.idPrefix}-active-false`)
</script>

<template>
  <div class="space-y-3">
    <label class="body-m-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>
    <RadioGroup
      :model-value="stringValue"
      :disabled="disabled"
      class="flex gap-6"
      @update:model-value="onChange"
    >
      <div class="flex items-center space-x-2">
        <RadioGroupItem value="true" :id="trueId" />
        <label :for="trueId" class="body-m cursor-pointer">{{ trueLabel }}</label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem value="false" :id="falseId" />
        <label :for="falseId" class="body-m cursor-pointer">{{ falseLabel }}</label>
      </div>
    </RadioGroup>
  </div>
</template>
