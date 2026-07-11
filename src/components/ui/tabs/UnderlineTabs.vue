<script setup lang="ts" generic="K extends string">
  import type { HTMLAttributes } from 'vue'
  import TabButton from './TabButton.vue'
  import type { TabItem } from './types'

  defineProps<{
    items: TabItem<K>[]
    modelValue: K
    /** Container class overrides. */
    class?: HTMLAttributes['class']
  }>()

  defineEmits<{ 'update:modelValue': [value: K] }>()
</script>

<template>
  <nav
    role="tablist"
    :class="[
      'scrollbar-none flex items-center gap-6 overflow-x-auto border-b border-neutral-200',
      $props.class,
    ]"
  >
    <TabButton
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :active="modelValue === item.key"
      :count="item.count"
      :count-tone="item.countTone"
      :class="[
        'shrink-0 border-b-2 pt-1 pb-3',
        modelValue === item.key ? 'border-primary-600' : 'border-transparent',
      ]"
      @click="$emit('update:modelValue', item.key)"
    />
  </nav>
</template>
