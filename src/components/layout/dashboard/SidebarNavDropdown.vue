<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { useRoute, RouterLink } from 'vue-router'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { cn } from '@/utils/cn'

  export interface DropdownNavItem {
    /** Unique identifier */
    id: string
    /** Display label */
    label: string
    /** Route path */
    to?: string
    /** Whether item is disabled */
    disabled?: boolean
  }

  interface Props {
    /** Icon component */
    icon?: Component
    /** Label text */
    label: string
    /** Child items */
    items: DropdownNavItem[]
    /** Child routes to check for active state */
    childRoutes?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    childRoutes: () => [],
  })

  const route = useRoute()

  // Check if any child is active
  const hasActiveChild = computed(() => {
    return props.childRoutes.some(path => route.path.startsWith(path))
  })

  const triggerClass = computed(() =>
    cn(
      'flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200',
      'text-white/70 hover:bg-white/10 hover:text-white',
      hasActiveChild.value && 'bg-white/10 text-white',
    ),
  )
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :class="triggerClass">
      <component :is="icon" v-if="icon" class="h-5 w-5 shrink-0" />
    </DropdownMenuTrigger>

    <DropdownMenuContent side="right" :side-offset="8" align="start" class="min-w-50">
      <!-- Parent Label -->
      <div class="px-2 py-1.5 text-sm font-semibold">
        {{ label }}
      </div>

      <!-- Child Items -->
      <DropdownMenuItem
        v-for="item in items"
        :key="item.id"
        :disabled="item.disabled"
        :as-child="!!item.to"
      >
        <RouterLink v-if="item.to" :to="item.to" class="w-full cursor-pointer">
          {{ item.label }}
        </RouterLink>
        <span v-else class="w-full">{{ item.label }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
