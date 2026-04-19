/** * RecipientInfoCardSkeleton * Skeleton loading state for RecipientInfoCard component * Displays
animated placeholder for recipient information * * @component * @example *
<RecipientInfoCardSkeleton />
* *
<RecipientInfoCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { Item, ItemContent } from '@/components/ui/item'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for RecipientInfoCardSkeleton component
   */
  interface RecipientInfoCardSkeletonProps {
    /** Additional CSS classes to apply to the item */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RecipientInfoCardSkeletonProps>(), {})
</script>

<template>
  <Item
    as="div"
    variant="outline"
    :class="cn('w-full gap-2 rounded-lg border-neutral-200 bg-white p-3', props.class)"
    data-testid="recipient-info-card-skeleton"
    aria-busy="true"
    role="presentation"
  >
    <ItemContent class="items-start gap-0.5">
      <!-- Name Skeleton -->
      <Skeleton class="h-4 w-32 rounded-sm" />

      <!-- Email and Phone Skeleton -->
      <div class="flex w-full items-center gap-2">
        <Skeleton class="h-3 w-40 rounded-sm" />
        <Skeleton class="size-1 rounded-full" />
        <Skeleton class="h-3 w-28 rounded-sm" />
      </div>
    </ItemContent>

    <!-- Chevron Icon Skeleton -->
    <Skeleton class="size-4 shrink-0 self-center rounded-full" />
  </Item>
</template>
