<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { SearchIcon, XIcon } from 'lucide-vue-next'
  import { Input, InputGroup } from '@/components/ui/input'

  interface Props {
    modelValue?: string
    placeholder?: string
    class?: HTMLAttributes['class']
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Search...',
    disabled: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

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
    :class="[
      props.class,
      'h-11 rounded-full',
      disabled ? 'border-0 bg-slate-100' : 'border border-slate-200 bg-white',
    ]"
    :disabled="disabled"
  >
    <template #prefix>
      <SearchIcon class="size-4 text-slate-500" />
    </template>
    <Input
      type="text"
      :placeholder="placeholder"
      :model-value="modelValue"
      :disabled="disabled"
      unstyled
      class="text-sm text-slate-950 placeholder:text-slate-400 disabled:text-slate-500 disabled:placeholder:text-slate-500"
      @input="handleInput"
    />
    <template v-if="modelValue" #suffix>
      <button
        type="button"
        class="flex shrink-0 items-center justify-center text-slate-500 hover:text-slate-700 disabled:opacity-50"
        :disabled="disabled"
        @click="handleClear"
      >
        <XIcon class="size-4" />
      </button>
    </template>
  </InputGroup>
</template>
