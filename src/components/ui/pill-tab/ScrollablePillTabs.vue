<script setup lang="ts">
  import { ref, nextTick, type ComponentPublicInstance, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import PillTab from './PillTab.vue'
  import type { PillTabVariants } from '.'

  export interface PillTabItem {
    key: string
    label: string
  }

  interface Props {
    /** Array of tab items */
    items: PillTabItem[]
    /** Currently active tab key */
    modelValue: string
    /** Active state variant */
    activeState?: PillTabVariants['state']
    /** Inactive state variant */
    inactiveState?: PillTabVariants['state']
    /** Container class */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    activeState: 'active',
    inactiveState: 'default',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    change: [value: string]
  }>()

  // Refs
  const containerRef = ref<HTMLElement | null>(null)
  const itemRefs = ref<(ComponentPublicInstance | null)[]>([])

  // Methods
  const setItemRef = (el: ComponentPublicInstance | null, index: number) => {
    itemRefs.value[index] = el
  }

  const scrollToItem = (index: number) => {
    const container = containerRef.value
    const itemInstance = itemRefs.value[index]
    const activeItemEl = itemInstance?.$el as HTMLElement | undefined
    if (!container || !activeItemEl) return

    const scrollTarget =
      activeItemEl.offsetLeft - (container.offsetWidth - activeItemEl.offsetWidth) / 2
    container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' })
  }

  const handleItemClick = (key: string, index: number) => {
    emit('update:modelValue', key)
    emit('change', key)
    nextTick(() => scrollToItem(index))
  }

  const getItemState = (key: string) => {
    return props.modelValue === key ? props.activeState : props.inactiveState
  }

  // Slots
  defineSlots<{
    default?: (props: { item: PillTabItem; isActive: boolean }) => unknown
  }>()
</script>

<template>
  <div
    ref="containerRef"
    :class="
      cn(
        'flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        props.class,
      )
    "
    data-slot="scrollable-pill-tabs"
  >
    <PillTab
      v-for="(item, index) in items"
      :key="item.key"
      :ref="el => setItemRef(el as ComponentPublicInstance | null, index)"
      :state="getItemState(item.key)"
      @click="handleItemClick(item.key, index)"
    >
      <slot :item="item" :is-active="modelValue === item.key">
        {{ item.label }}
      </slot>
    </PillTab>
  </div>
</template>
