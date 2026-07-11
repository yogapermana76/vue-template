<script setup lang="ts">
  import { computed } from 'vue'
  import { TrendingDown, TrendingUp } from 'lucide-vue-next'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import type { StatTrend } from '../types'
  import type { Component } from 'vue'

  const props = defineProps<{
    title: string
    value: string
    change: string
    trend: StatTrend
    icon: Component
    comparisonLabel?: string
  }>()

  const trendColor = computed(() => (props.trend === 'up' ? 'text-success-500' : 'text-error-500'))
  const trendIcon = computed(() => (props.trend === 'up' ? TrendingUp : TrendingDown))
  const comparison = computed(() => props.comparisonLabel ?? 'from last month')
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <CardTitle class="body-m-medium text-muted-foreground">{{ title }}</CardTitle>
      <component :is="icon" class="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent>
      <div class="heading-m">{{ value }}</div>
      <p class="body-caption mt-1 flex items-center gap-1">
        <component :is="trendIcon" class="h-3 w-3" :class="trendColor" />
        <span :class="trendColor">{{ change }}</span>
        <span class="text-muted-foreground">{{ comparison }}</span>
      </p>
    </CardContent>
  </Card>
</template>
