<script setup lang="ts">
  import { ref, computed, type Component, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { ChevronDown } from 'lucide-vue-next'
  import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'
  import { cn } from '@/utils/cn'

  interface Props {
    /** Icon component */
    icon?: Component
    /** Label text */
    label: string
    /** Whether sidebar is collapsed */
    collapsed?: boolean
    /** Child routes to check for active state */
    childRoutes?: string[]
    /** Default open state */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
    childRoutes: () => [],
    defaultOpen: false,
  })

  const route = useRoute()
  const isOpen = ref(props.defaultOpen)

  // Check if any child is active
  const hasActiveChild = computed(() => {
    return props.childRoutes.some(path => route.path.startsWith(path))
  })

  // Auto-open when child is active
  watch(
    hasActiveChild,
    active => {
      if (active) isOpen.value = true
    },
    { immediate: true },
  )

  const triggerClass = computed(() =>
    cn(
      'flex w-full items-center rounded-lg transition-all duration-200',
      'text-white/70 hover:bg-white/10 hover:text-white',
      props.collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
      hasActiveChild.value && 'bg-white/10 text-white',
    ),
  )

  const chevronClass = computed(() =>
    cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen.value && 'rotate-180'),
  )
</script>

<template>
  <!-- Collapsed: Show dropdown via slot -->
  <slot
    v-if="collapsed"
    name="collapsed"
    :trigger-class="triggerClass"
    :has-active-child="hasActiveChild"
  />

  <!-- Expanded: Collapsible menu -->
  <CollapsibleRoot v-else v-model:open="isOpen">
    <CollapsibleTrigger :class="triggerClass">
      <component :is="icon" v-if="icon" class="h-5 w-5 shrink-0" />
      <span class="flex-1 truncate text-left">{{ label }}</span>
      <ChevronDown :class="chevronClass" />
    </CollapsibleTrigger>

    <CollapsibleContent
      class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
    >
      <div class="mt-1 ml-4 space-y-1 border-l border-white/20 pl-3">
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
