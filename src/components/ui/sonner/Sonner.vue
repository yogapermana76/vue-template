<script lang="ts" setup>
  import type { ToasterProps } from 'vue-sonner'
  import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
    XIcon,
  } from 'lucide-vue-next'
  import { Toaster as Sonner } from 'vue-sonner'
  import { cn } from '@/utils/cn'

  const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--color-white)',
      '--normal-text': 'var(--color-neutral-900)',
      '--normal-border': 'var(--color-neutral-200)',
      '--border-radius': 'var(--radius)',
      '--success-bg': 'var(--color-success-50)',
      '--success-text': 'var(--color-success-800)',
      '--success-border': 'var(--color-success-200)',
      '--error-bg': 'var(--color-error-50)',
      '--error-text': 'var(--color-error-800)',
      '--error-border': 'var(--color-error-200)',
      '--warning-bg': 'var(--color-warning-50)',
      '--warning-text': 'var(--color-warning-800)',
      '--warning-border': 'var(--color-warning-200)',
      '--info-bg': 'var(--color-info-50)',
      '--info-text': 'var(--color-info-800)',
      '--info-border': 'var(--color-info-200)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <CircleCheckIcon class="text-success-600 size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="text-info-600 size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="text-warning-600 size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="text-error-600 size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="text-primary-500 size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
