<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'
  import {
    Item,
    ItemMedia,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
  } from '@/components/ui/item'
  import type { Component } from 'vue'

  export interface ActionItemProps {
    icon: Component
    title: string
    subtitle: string
  }

  withDefaults(defineProps<ActionItemProps>(), {})

  defineEmits<{
    click: []
  }>()
</script>

<template>
  <Item
    class="h-14 cursor-pointer flex-nowrap rounded-lg border-0 bg-white transition-colors hover:bg-neutral-50"
    @click="$emit('click')"
  >
    <!-- Left Icon -->
    <ItemMedia class="[&_svg]:text-primary-600 [&_svg]:stroke-1.5 self-center! [&_svg]:size-5">
      <component :is="icon" />
    </ItemMedia>

    <!-- Text Content -->
    <ItemContent>
      <ItemTitle :class="['text-neutral-950', 'text-sm', 'font-semibold']">
        {{ title }}
      </ItemTitle>
      <ItemDescription :class="['text-neutral-600', 'text-xs', 'text-left']">
        {{ subtitle }}
      </ItemDescription>
    </ItemContent>

    <!-- Right Chevron -->
    <ItemActions class="ml-auto">
      <ChevronRight class="size-4 text-neutral-400" />
    </ItemActions>
  </Item>
</template>
