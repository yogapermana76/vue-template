<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { SearchIcon, XCircleIcon } from 'lucide-vue-next'
  import { Input, InputGroup } from '@/components/ui/input'
  import { searchInputVariants } from './variants'

  interface Props {
    modelValue?: string
    placeholder?: string
    class?: HTMLAttributes['class']
    disabled?: boolean
    variant?: 'default' | 'glass'
    clearable?: boolean
    /** Height preset: 'md' (h-11, default) or 'sm' (h-10 for toolbars) */
    size?: 'sm' | 'md'
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Search...',
    disabled: false,
    clearable: true,
    variant: 'default',
    size: 'md',
  })

  const heightClass = computed(() => (props.size === 'sm' ? 'h-10' : 'h-11'))

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const showClear = computed(() => !!props.modelValue && props.clearable)

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const handleClear = () => {
    emit('update:modelValue', '')
  }
</script>

<template>
  <InputGroup
    :class="
      searchInputVariants({
        variant: props.variant,
        disabled: props.disabled,
        class: [props.class, 'rounded-full', heightClass],
      })
    "
    :disabled="disabled"
  >
    <template #prefix>
      <SearchIcon
        :class="
          searchInputVariants({
            variant: props.variant,
            element: 'icon',
          })
        "
      />
    </template>
    <Input
      type="text"
      :placeholder="placeholder"
      :model-value="modelValue"
      :disabled="disabled"
      :class="
        searchInputVariants({
          variant: props.variant,
          disabled: props.disabled,
          element: 'input',
        })
      "
      unstyled
      @input="handleInput"
    />
    <template v-if="clearable" #suffix>
      <button
        v-if="showClear"
        type="button"
        :class="
          searchInputVariants({
            variant: props.variant,
            element: 'button',
          })
        "
        :disabled="disabled"
        @click="handleClear"
      >
        <XCircleIcon class="size-4" />
      </button>
    </template>
  </InputGroup>
</template>
