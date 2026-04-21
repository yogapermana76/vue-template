<script lang="ts" setup>
  import type { ToasterProps } from 'vue-sonner'
  import { computed } from 'vue'
  import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    TriangleAlertIcon,
    XCircleIcon,
    XIcon,
  } from 'lucide-vue-next'
  import { Toaster as Sonner } from 'vue-sonner'
  import { cn } from '@/utils/cn'
  import { useSafeArea } from '@/composables/ui'

  const props = defineProps<ToasterProps>()
  const { safeAreaBottom } = useSafeArea()

  const toasterStyle = computed(() => ({
    '--normal-bg': 'var(--color-white)',
    '--normal-text': 'var(--color-neutral-900)',
    '--normal-border': 'var(--color-neutral-200)',
    '--border-radius': 'var(--radius-sm)',
    '--success-bg': 'var(--color-success-600)',
    '--success-text': 'var(--color-white)',
    '--success-border': 'var(--color-success-600)',
    '--error-bg': 'var(--color-error-600)',
    '--error-text': 'var(--color-white)',
    '--error-border': 'var(--color-error-600)',
    '--warning-bg': 'var(--color-warning-700)',
    '--warning-text': 'var(--color-white)',
    '--warning-border': 'var(--color-warning-700)',
    '--info-bg': 'var(--color-info-600)',
    '--info-text': 'var(--color-white)',
    '--info-border': 'var(--color-info-600)',
    // Add safe area offset for bottom position
    // If no safe area, use undefined to let vue-sonner use its default offset
    ...(safeAreaBottom.value > 0 && {
      '--offset': `${safeAreaBottom.value}px`,
    }),
  }))
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="toasterStyle"
    v-bind="props"
    position="bottom-center"
    rich-colors
    close-button
    :swipe-directions="['top', 'right']"
  >
    <template #success-icon>
      <CircleCheckIcon class="text-success-100 size-5" />
    </template>
    <template #info-icon>
      <InfoIcon class="text-info-100 size-5" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="text-warning-100 size-5" />
    </template>
    <template #error-icon>
      <XCircleIcon class="text-error-100 size-5" />
    </template>
    <template #loading-icon>
      <Loader2Icon class="size-5 animate-spin text-white" />
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>

<style>
  .toaster [data-sonner-toast] {
    padding: var(--spacing-3);
    gap: var(--spacing-3);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  }

  .toaster [data-sonner-toast] [data-title] {
    font-size: var(--text-sm);
    line-height: var(--leading-sm);
    font-weight: 600;
  }

  .toaster [data-sonner-toast] [data-description] {
    font-size: var(--text-xs);
    line-height: var(--leading-xs);
    font-weight: 400;
    opacity: 0.75;
  }

  .toaster [data-sonner-toast] [data-close-button] {
    position: absolute !important;
    top: 12px !important;
    right: 12px !important;
    left: auto !important;
    bottom: auto !important;
    transform: none !important;
    background: transparent !important;
    border: none !important;
    color: inherit;
  }
</style>
