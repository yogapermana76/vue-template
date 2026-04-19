/** * AlertBoxSkeleton * Skeleton loading state for AlertBox component * Displays animated
placeholder with alert-like structure * * @component * @example *
<AlertBoxSkeleton />
* *
<AlertBoxSkeleton variant="success" />
* *
<AlertBoxSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import type { AlertVariants } from '.'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'
  import { alertVariants } from '.'

  /**
   * Props for AlertBoxSkeleton component
   */
  interface AlertBoxSkeletonProps {
    /** Additional CSS classes to apply to the container */
    class?: HTMLAttributes['class']
    /** Alert variant to match the background color style */
    variant?: AlertVariants['variant']
    /** Whether to show icon skeleton */
    showIcon?: boolean
    /** Whether to show description skeleton (multiple lines) */
    showDescription?: boolean
  }

  const props = withDefaults(defineProps<AlertBoxSkeletonProps>(), {
    variant: 'info',
    showIcon: true,
    showDescription: true,
  })
</script>

<template>
  <div
    data-testid="alert-box-skeleton"
    data-slot="alert"
    :class="cn(alertVariants({ variant }), props.class)"
    role="alert"
    aria-busy="true"
  >
    <!-- Icon Skeleton -->
    <Skeleton v-if="showIcon" class="size-5 shrink-0 rounded-sm bg-current opacity-20" />

    <!-- Content Skeleton -->
    <div class="flex flex-1 flex-col items-start gap-1.5">
      <!-- Title Skeleton -->
      <Skeleton class="h-3.5 w-3/4 rounded-sm bg-current opacity-20" />

      <!-- Description Skeleton -->
      <template v-if="showDescription">
        <Skeleton class="h-3 w-full rounded-sm bg-current opacity-20" />
        <Skeleton class="h-3 w-5/6 rounded-sm bg-current opacity-20" />
      </template>
    </div>
  </div>
</template>
