<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ChevronDown } from 'lucide-vue-next'
  import { TextField } from '@/components/ui/form'
  import LocationPicker from './LocationPicker.vue'
  import type { LocationFieldProps, SelectedLocation } from './types'

  const props = withDefaults(defineProps<LocationFieldProps>(), {
    placeholder: 'Pilih Kota/Kecamatan',
    pickerTitle: 'Kota, Kecamatan',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: SelectedLocation | undefined]
    change: [value: SelectedLocation | undefined]
  }>()

  // ============================================
  // State
  // ============================================

  const isPickerOpen = ref(false)

  // ============================================
  // Computed
  // ============================================

  const displayValue = computed(() => {
    if (!props.modelValue) return ''

    const parts: string[] = []

    // Show province name if available
    if (props.modelValue.provinceId && props.provinceNames?.[props.modelValue.provinceId]) {
      parts.push(props.provinceNames[props.modelValue.provinceId])
    }

    // Show city name if available
    if (props.modelValue.cityId && props.cityNames?.[props.modelValue.cityId]) {
      parts.push(props.cityNames[props.modelValue.cityId])
    }

    // Show district name if available
    if (props.modelValue.districtId && props.districtNames?.[props.modelValue.districtId]) {
      parts.push(props.districtNames[props.modelValue.districtId])
    }

    return parts.join(', ') || ''
  })

  // ============================================
  // Handlers
  // ============================================

  const handleFieldClick = () => {
    if (!props.disabled) {
      isPickerOpen.value = true
    }
  }

  const handleSave = (selection: SelectedLocation) => {
    emit('update:modelValue', selection)
    emit('change', selection)
  }
</script>

<template>
  <div class="relative">
    <!-- Read-only TextField with Icon -->
    <TextField
      :model-value="displayValue"
      :label="label"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :error="error"
      :helper="helper"
      :suffix-icon="ChevronDown"
      :class="props.class"
      readonly
      @click="handleFieldClick"
    >
      <!-- Label Right Slot -->
      <template #labelRight>
        <slot name="labelRight" />
      </template>

      <!-- Helper Slot -->
      <template v-if="$slots.helper" #helper>
        <slot name="helper" />
      </template>
    </TextField>

    <!-- Location Picker Modal -->
    <LocationPicker
      v-model:open="isPickerOpen"
      :title="pickerTitle"
      :selected-location="modelValue"
      @save="handleSave"
    />
  </div>
</template>
