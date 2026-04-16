/** * PillTabSkeleton * Skeleton loading state for PillTab component * Displays animated placeholder
for pill-shaped tab button * * @component * @example *
<PillTabSkeleton />
* *
<PillTabSkeleton class="mb-2" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for PillTabSkeleton component
   */
  interface PillTabSkeletonProps {
    /** Additional CSS classes to apply to the container */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<PillTabSkeletonProps>(), {})
</script>

<template>
  <Skeleton
    data-testid="pill-tab-skeleton"
    :class="cn('h-8 w-full rounded-full', props.class)"
    aria-busy="true"
  />
</template>
