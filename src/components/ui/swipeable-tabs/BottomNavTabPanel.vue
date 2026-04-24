<script setup lang="ts">
  import { type HTMLAttributes } from 'vue'
  import SwipeableTabPanel from './SwipeableTabPanel.vue'

  interface Props {
    value: string
    class?: HTMLAttributes['class']
    lazy?: boolean
    noPadding?: boolean
  }

  defineProps<Props>()
</script>

<template>
  <SwipeableTabPanel
    :value="value"
    :class="['pb-20', $props.class]"
    :lazy="lazy"
    :no-padding="noPadding"
  >
    <slot />
  </SwipeableTabPanel>
</template>
