<script setup lang="ts">
  import type { Component } from 'vue'
  import { MoreVertical } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'

  export interface TableAction {
    /**
     * Unique identifier for the action
     */
    key: string

    /**
     * Action label text
     */
    label: string

    /**
     * Icon component from lucide-vue-next
     */
    icon?: Component

    /**
     * Click handler
     */
    onClick: () => void

    /**
     * Action variant/type
     */
    variant?: 'default' | 'destructive'

    /**
     * Disable the action
     */
    disabled?: boolean

    /**
     * Show separator after this action
     */
    separator?: boolean
  }

  interface Props {
    /**
     * Array of action items
     */
    actions: TableAction[]

    /**
     * Alignment of dropdown menu
     */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<Props>(), {
    align: 'end',
  })
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="tertiary" size="sm" layout="iconOnly">
        <slot name="trigger">
          <MoreVertical class="size-4" />
        </slot>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align="align">
      <template v-for="(action, index) in actions" :key="action.key">
        <DropdownMenuItem
          :disabled="action.disabled"
          :class="action.variant === 'destructive' ? 'text-error-600' : ''"
          @click="action.onClick"
        >
          <component :is="action.icon" v-if="action.icon" class="mr-2 size-4" />
          <span>{{ action.label }}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="action.separator && index < actions.length - 1" />
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
