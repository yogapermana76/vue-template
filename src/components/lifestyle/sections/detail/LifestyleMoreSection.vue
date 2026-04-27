<script setup lang="ts">
  import type { Component } from 'vue'
  import { ActionItem } from '@/components/ui'

  export interface LifestyleMoreItem {
    id: string
    icon: Component
    title: string
    subtitle: string
  }

  interface Props {
    title?: string
    items: LifestyleMoreItem[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Informasi Lainnya',
  })

  const emit = defineEmits<{
    itemClick: [itemId: string]
  }>()
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="body-l-semibold px-4 text-slate-950">{{ title }}</h2>
    <div class="flex flex-col">
      <ActionItem
        v-for="item in items"
        :key="item.id"
        :icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
        @click="emit('itemClick', item.id)"
      />
    </div>
  </section>
</template>
