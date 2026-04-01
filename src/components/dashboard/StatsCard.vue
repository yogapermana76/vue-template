<script setup lang="ts">
  import type { Component } from 'vue'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

  interface Props {
    title: string
    value: string | number
    change?: string
    icon?: Component
  }

  defineProps<Props>()
</script>

<template>
  <Card class="border-primary-100 hover:border-primary-200 transition-colors">
    <CardHeader class="p-3 pb-1">
      <div class="flex items-center justify-between">
        <CardTitle class="text-xs font-medium text-neutral-600">{{ title }}</CardTitle>
        <component v-if="icon" :is="icon" class="text-primary-400 size-3.5" />
      </div>
    </CardHeader>
    <CardContent class="p-3 pt-0">
      <div class="text-primary-700 text-lg leading-none font-bold">{{ value }}</div>
      <p v-if="change" class="text-muted-foreground mt-1 text-[10px]">
        <span class="text-success-600 font-medium">{{ change }}</span>
      </p>
      <slot />
    </CardContent>
  </Card>
</template>
