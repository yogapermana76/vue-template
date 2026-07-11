<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import { useRoute, RouterLink } from 'vue-router'
  import { Check } from 'lucide-vue-next'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { cn } from '@/utils/cn'

  export interface DropdownNavItem {
    id: string
    label: string
    to?: string
    icon?: Component
    disabled?: boolean
  }

  interface Props {
    /** Parent icon (shown in the collapsed sidebar trigger) */
    icon?: Component
    /** Parent label (shown as the dropdown popover title) */
    label: string
    /** Child items */
    items: DropdownNavItem[]
    /** Child routes used to detect active state */
    childRoutes?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    childRoutes: () => [],
  })

  const route = useRoute()

  const hasActiveChild = computed(() => props.childRoutes.some(path => route.path.startsWith(path)))

  const isChildActive = (child: DropdownNavItem) => !!child.to && route.path.startsWith(child.to)

  /**
   * Trigger styling — matches SidebarNavItemCollapsible (dark bg, white/70 text,
   * gradient wash + inset accent when a child route is active).
   */
  const triggerClass = computed(() =>
    cn(
      'flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200',
      'text-white/70 hover:bg-white/10 hover:text-white',
      'data-[state=open]:bg-white/10 data-[state=open]:text-white',
      hasActiveChild.value &&
        'bg-linear-to-r from-primary-400/25 to-primary-400/5 text-white shadow-[inset_3px_0_0_var(--color-primary-400)]',
    ),
  )
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger :class="triggerClass" :aria-label="label">
      <component :is="icon" v-if="icon" class="size-5 shrink-0" />
    </DropdownMenuTrigger>

    <!-- Popover styled as a "sidebar continuation": tighter padding, section
         header instead of raw label, icon per child, active check indicator.
         `side="right" :side-offset="12"` gives a small gap from the sidebar rail. -->
    <DropdownMenuContent
      side="right"
      align="start"
      :side-offset="12"
      class="min-w-56 overflow-hidden rounded-lg p-0 shadow-lg"
    >
      <!-- Section header — mirrors sidebar group label look -->
      <div
        class="from-primary-50/60 border-b border-neutral-100 bg-linear-to-r to-transparent px-3 py-2"
      >
        <p class="text-xxs font-semibold tracking-wider text-neutral-500 uppercase">
          {{ label }}
        </p>
      </div>

      <!-- Child items — icon + label + active check -->
      <div class="p-1">
        <DropdownMenuItem
          v-for="item in items"
          :key="item.id"
          :disabled="item.disabled"
          :as-child="!!item.to"
          :class="
            cn(
              'group cursor-pointer gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium',
              'focus:bg-primary-50 focus:text-primary-800 text-neutral-700',
              isChildActive(item) && 'bg-primary-50/70 text-primary-800',
            )
          "
        >
          <RouterLink v-if="item.to" :to="item.to" class="flex w-full items-center gap-2.5">
            <component
              :is="item.icon"
              v-if="item.icon"
              :class="[
                'size-4 shrink-0',
                isChildActive(item)
                  ? 'text-primary-600'
                  : 'group-focus:text-primary-600 text-neutral-500',
              ]"
            />
            <span class="flex-1 truncate">{{ item.label }}</span>
            <Check v-if="isChildActive(item)" class="text-primary-600 size-3.5 shrink-0" />
          </RouterLink>
          <div v-else class="flex w-full items-center gap-2.5">
            <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0 text-neutral-500" />
            <span class="flex-1 truncate">{{ item.label }}</span>
          </div>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
