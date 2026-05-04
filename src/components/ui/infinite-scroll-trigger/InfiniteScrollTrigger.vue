<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { Loader2 } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'

  interface Props {
    /** Whether currently fetching next page */
    isFetching?: boolean
    /** Whether there are more pages to load */
    hasMore?: boolean
    /** Total number of pages loaded (to determine if pagination has occurred) */
    currentPage?: number
    /** Custom loading text */
    loadingText?: string
    /** Custom end text */
    endText?: string
    /** Custom class for container */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    isFetching: false,
    hasMore: true,
    currentPage: 1,
    loadingText: 'Memuat lebih banyak...',
    endText: 'Anda telah mencapai akhir',
  })

  // Only show "end" message if we've loaded more than 1 page
  const shouldShowEndMessage = () => !props.hasMore && props.currentPage > 1
</script>

<template>
  <div
    v-if="isFetching || shouldShowEndMessage()"
    :class="cn('flex justify-center py-4', props.class)"
  >
    <!-- Loading state -->
    <div v-if="isFetching" class="flex items-center gap-2">
      <Loader2 class="text-primary-500 size-5 animate-spin" />
      <span class="body-m text-neutral-500">{{ loadingText }}</span>
    </div>

    <!-- End of list (only show if we've paginated) -->
    <p v-else-if="shouldShowEndMessage()" class="body-m text-neutral-500">{{ endText }}</p>
  </div>
</template>
