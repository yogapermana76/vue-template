<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import * as icons from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import type { HeaderAction } from '@/types/header'

  const props = defineProps<{
    action: HeaderAction
  }>()

  /** Resolve icon component from name (e.g., 'share-2' -> Share2) */
  const iconComponent = computed<Component | null>(() => {
    if (!props.action.icon) return null

    // Convert kebab-case to PascalCase (e.g., 'share-2' -> 'Share2')
    const pascalCase = props.action.icon
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    return (icons as unknown as Record<string, Component>)[pascalCase] || null
  })
</script>

<template>
  <Button
    variant="tertiary"
    size="md"
    layout="iconOnly"
    :title="action.label"
    @click="action.onClick"
  >
    <component v-if="iconComponent" :is="iconComponent" class="size-4" />
    <span v-else class="text-sm">{{ action.label }}</span>
  </Button>
</template>
