<script setup lang="ts">
  import { IconButton } from '@/components/ui/button'
  import type { HeaderAction } from '@/types'

  defineProps<{
    action: HeaderAction
  }>()
</script>

<template>
  <IconButton
    variant="tertiary"
    size="md"
    class="text-neutral-950"
    :title="action.label"
    @click="action.onClick"
  >
    <slot>
      <span class="body-m">{{ action.label }}</span>
    </slot>
  </IconButton>
</template>
