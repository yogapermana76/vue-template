/** * InfoCardSkeleton * Skeleton loading state for InfoCard component * Displays animated
placeholder with gradient background and light-colored skeleton elements * * @component * @example *
<InfoCardSkeleton />
*
<InfoCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for InfoCardSkeleton component
   */
  interface InfoCardSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<InfoCardSkeletonProps>(), {})
</script>

<template>
  <Skeleton
    data-testid="info-card-skeleton"
    :class="cn('relative flex h-50 w-36 flex-col overflow-hidden rounded-sm p-3', props.class)"
    aria-busy="true"
  />
</template>
