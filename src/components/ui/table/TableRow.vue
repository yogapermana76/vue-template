<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
    clickable?: boolean
    selected?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    clickable: false,
    selected: false,
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const handleClick = (event: MouseEvent) => {
    if (props.clickable) {
      emit('click', event)
    }
  }
</script>

<template>
  <tr
    data-slot="table-row"
    :data-clickable="clickable"
    :data-selected="selected"
    :class="
      cn(
        'transition-colors',
        clickable && 'cursor-pointer hover:bg-neutral-50',
        selected && 'bg-primary-50',
        props.class,
      )
    "
    @click="handleClick"
  >
    <slot />
  </tr>
</template>
