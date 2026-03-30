<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { Search } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Input } from '@/components/ui/input'

  interface Props {
    modelValue?: string
    placeholder?: string
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Search...',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }
</script>

<template>
  <div :class="cn('relative', props.class)">
    <Search
      class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
    />
    <Input
      type="search"
      :placeholder="placeholder"
      class="pl-10"
      :model-value="modelValue"
      @input="handleInput"
    />
  </div>
</template>
