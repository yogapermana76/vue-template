<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import type { QuickAction } from '../types'

  withDefaults(
    defineProps<{
      title?: string
      actions: QuickAction[]
    }>(),
    {
      title: 'Quick Actions',
    },
  )

  const emit = defineEmits<{
    select: [action: QuickAction]
  }>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-4">
        <template v-for="action in actions" :key="action.key">
          <RouterLink
            v-if="action.to"
            :to="action.to"
            class="border-border bg-card hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors"
          >
            <div class="bg-primary-100 flex size-10 items-center justify-center rounded-full">
              <component :is="action.icon" class="text-primary-600 size-5" />
            </div>
            <span class="body-m-medium">{{ action.label }}</span>
          </RouterLink>
          <button
            v-else
            type="button"
            class="border-border bg-card hover:bg-accent flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors"
            @click="emit('select', action)"
          >
            <div class="bg-primary-100 flex size-10 items-center justify-center rounded-full">
              <component :is="action.icon" class="text-primary-600 size-5" />
            </div>
            <span class="body-m-medium">{{ action.label }}</span>
          </button>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
