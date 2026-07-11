<script setup lang="ts">
  import { LogOut } from 'lucide-vue-next'
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
  import { cn } from '@/utils/cn'

  /**
   * Sidebar footer logout button.
   *
   * Deliberately mirrors `SidebarNavItem`'s dark-variant treatment so the
   * button sits flush with the nav row above it — same padding, same icon
   * size, same hover state, same tooltip behaviour when collapsed. Keeps
   * the sidebar visually consistent top-to-bottom.
   */
  withDefaults(defineProps<{ collapsed?: boolean }>(), { collapsed: false })

  defineEmits<{ click: [] }>()

  const itemClass = cn(
    'flex w-full items-center rounded-lg transition-all duration-200 text-left',
    'text-white/80 hover:bg-white/10 hover:text-white',
  )
</script>

<template>
  <!-- Collapsed rail: icon-only tile with right-side tooltip -->
  <Tooltip v-if="collapsed" :delay-duration="0">
    <TooltipTrigger as-child>
      <button
        type="button"
        aria-label="Keluar"
        :class="cn(itemClass, 'justify-center p-2.5')"
        @click="$emit('click')"
      >
        <LogOut class="h-5 w-5 shrink-0" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="right" :side-offset="8">
      <p>Keluar</p>
    </TooltipContent>
  </Tooltip>

  <!-- Expanded: icon + label row -->
  <button v-else type="button" :class="cn(itemClass, 'gap-3 px-3 py-2.5')" @click="$emit('click')">
    <LogOut class="h-5 w-5 shrink-0" />
    <span class="flex-1 truncate">Keluar</span>
  </button>
</template>
