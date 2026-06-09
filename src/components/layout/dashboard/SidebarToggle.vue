<script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
  import { cn } from '@/utils/cn'

  interface Props {
    /** Whether sidebar is collapsed */
    collapsed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
  })

  defineEmits<{
    toggle: []
  }>()

  // Styling for gradient sidebar (white text)
  const buttonClass = computed(() =>
    cn(
      'flex w-full items-center rounded-lg px-3 py-2.5',
      'text-white/60 hover:bg-white/10 hover:text-white transition-colors',
      props.collapsed && 'justify-center px-2',
    ),
  )
</script>

<template>
  <Tooltip v-if="collapsed" :delay-duration="0">
    <TooltipTrigger as-child>
      <button type="button" :class="buttonClass" @click="$emit('toggle')">
        <ChevronRight class="h-5 w-5 shrink-0" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="right" :side-offset="8">
      <p>Expand sidebar</p>
    </TooltipContent>
  </Tooltip>

  <button v-else type="button" :class="buttonClass" @click="$emit('toggle')">
    <ChevronLeft class="h-5 w-5 shrink-0" />
    <span class="ml-3 text-sm">Collapse</span>
  </button>
</template>
