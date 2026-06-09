<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import type { BadgeVariants } from '@/components/ui/badge'
  import { ref } from 'vue'
  import { X } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { Input, InputGroup } from '@/components/ui/input'

  export interface TagInputProps {
    /** v-model value (array of strings) */
    modelValue?: string[]
    /** Placeholder text for input */
    placeholder?: string
    /** Disabled state */
    disabled?: boolean
    /** Allow duplicate tags */
    allowDuplicates?: boolean
    /** Maximum number of tags allowed */
    maxTags?: number
    /** Additional CSS classes for container */
    class?: HTMLAttributes['class']
    /** Validation function - return error message or null */
    validate?: (tag: string) => string | null
    /** Separator characters (default: Enter, comma) */
    separators?: string[]
    /** Badge variant for tags */
    variant?: BadgeVariants['variant']
    /** Prefix icon (from lucide-vue-next) */
    prefixIcon?: Component
    /** Invalid state (for error styling) */
    invalid?: boolean
  }

  const props = withDefaults(defineProps<TagInputProps>(), {
    modelValue: () => [],
    placeholder: 'Ketik dan tekan Enter...',
    disabled: false,
    allowDuplicates: false,
    variant: 'neutral',
    separators: () => ['Enter', ','],
    invalid: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
    'tag-added': [tag: string]
    'tag-removed': [tag: string]
    'validation-error': [message: string]
  }>()

  const inputValue = ref('')
  const isFocused = ref(false)
  const inputRef = ref<HTMLInputElement>()

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()

    if (!trimmedTag) {
      inputValue.value = ''
      return
    }

    // Check max tags limit
    if (props.maxTags && props.modelValue.length >= props.maxTags) {
      emit('validation-error', `Maksimal ${props.maxTags} tag`)
      inputValue.value = ''
      return
    }

    // Check for duplicates
    if (!props.allowDuplicates && props.modelValue.includes(trimmedTag)) {
      emit('validation-error', 'Tag sudah ada')
      inputValue.value = ''
      return
    }

    // Custom validation
    if (props.validate) {
      const error = props.validate(trimmedTag)
      if (error) {
        emit('validation-error', error)
        inputValue.value = ''
        return
      }
    }

    // Add the tag
    emit('update:modelValue', [...props.modelValue, trimmedTag])
    emit('tag-added', trimmedTag)
    inputValue.value = ''
  }

  const removeTag = (index: number) => {
    const removedTag = props.modelValue[index]
    const newValue = props.modelValue.filter((_, i) => i !== index)
    emit('update:modelValue', newValue)
    emit('tag-removed', removedTag)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Handle Enter key
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag(inputValue.value)
      return
    }

    // Handle comma separator
    if (props.separators.includes(',') && event.key === ',') {
      event.preventDefault()
      addTag(inputValue.value)
      return
    }

    // Handle Backspace on empty input to remove last tag
    if (event.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
      removeTag(props.modelValue.length - 1)
    }
  }

  const handleBlur = () => {
    isFocused.value = false
    // Optionally add tag on blur if there's input
    if (inputValue.value.trim()) {
      addTag(inputValue.value)
    }
  }

  const handleContainerClick = () => {
    if (!props.disabled) {
      inputRef.value?.focus()
    }
  }
</script>

<template>
  <InputGroup
    :prefix-icon="prefixIcon"
    :disabled="disabled"
    :invalid="invalid"
    :focused="isFocused"
    :class="['h-auto min-h-10 cursor-text py-1.5', disabled && 'cursor-not-allowed', props.class]"
    @click="handleContainerClick"
  >
    <div class="flex flex-1 flex-wrap items-center gap-1">
      <!-- Tags -->
      <Badge
        v-for="(tag, index) in modelValue"
        :key="`${tag}-${index}`"
        :variant="variant"
        class="shrink-0 gap-1 pr-1"
      >
        {{ tag }}
        <button
          v-if="!disabled"
          type="button"
          class="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none"
          @click.stop="removeTag(index)"
        >
          <X class="size-3" />
        </button>
      </Badge>

      <!-- Input -->
      <Input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        :disabled="disabled"
        unstyled
        class="min-w-20 flex-1"
        @keydown="handleKeyDown"
        @focus="isFocused = true"
        @blur="handleBlur"
      />
    </div>
  </InputGroup>
</template>
