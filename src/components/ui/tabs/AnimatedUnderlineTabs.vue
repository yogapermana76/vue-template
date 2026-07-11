<script setup lang="ts" generic="K extends string">
  import type { HTMLAttributes } from 'vue'
  import { computed, ref } from 'vue'
  import TabButton from './TabButton.vue'
  import type { TabItem } from './types'
  import { useAnimatedTabIndicator } from './useAnimatedTabIndicator'

  const props = defineProps<{
    items: TabItem<K>[]
    modelValue: K
    /** Stretch tabs to fill container width equally. */
    equalWidth?: boolean
    /** Container class overrides. */
    class?: HTMLAttributes['class']
  }>()

  defineEmits<{ 'update:modelValue': [value: K] }>()

  const containerRef = ref<HTMLElement | null>(null)
  const tabRefs = ref<HTMLElement[]>([])

  const setTabRef = (el: unknown, index: number) => {
    // Component refs expose $el on the instance; native refs land as HTMLElement.
    const node =
      el instanceof HTMLElement
        ? el
        : ((el as { $el?: unknown } | null)?.$el as HTMLElement | undefined)
    if (node instanceof HTMLElement) tabRefs.value[index] = node
  }

  const activeIndex = computed(() => props.items.findIndex(i => i.key === props.modelValue))

  const { indicator } = useAnimatedTabIndicator({ containerRef, tabRefs, activeIndex })
</script>

<template>
  <div
    ref="containerRef"
    role="tablist"
    :class="[
      'scrollbar-none relative flex overflow-x-auto border-b border-neutral-200',
      equalWidth ? 'gap-0' : 'gap-5',
      $props.class,
    ]"
  >
    <TabButton
      v-for="(item, index) in items"
      :key="item.key"
      :ref="el => setTabRef(el, index)"
      :label="item.label"
      :active="modelValue === item.key"
      :count="item.count"
      :count-tone="item.countTone"
      :class="['relative py-3', equalWidth ? 'flex-1 justify-center' : 'shrink-0']"
      @click="$emit('update:modelValue', item.key)"
    />

    <!-- Sliding indicator — glides between tabs. -->
    <div
      class="bg-primary-600 absolute bottom-0 h-1 rounded-t-sm transition-all duration-300 ease-out"
      :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
    />
  </div>
</template>
