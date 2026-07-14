<script setup lang="ts">
  import { computed } from 'vue'
  import type { QuotaGroup } from '../../types'
  import SubmissionQuotaGroup from './SubmissionQuotaGroup.vue'
  import SubmissionQuotaGroupSkeleton from './SubmissionQuotaGroupSkeleton.vue'

  const props = withDefaults(
    defineProps<{
      groups: QuotaGroup[]
      loading?: boolean
      /** Placeholder count while loading — mirrors typical response cardinality. */
      skeletonCount?: number
    }>(),
    { loading: false, skeletonCount: 2 },
  )

  // Alternate accents for visual differentiation; wraps at 2 to keep palette consistent.
  const accentFor = (index: number): 'primary' | 'secondary' =>
    index % 2 === 0 ? 'primary' : 'secondary'

  // Show skeletons only when there's no prior data to display. After the first
  // successful fetch, subsequent refetches keep the visible cards intact.
  const showSkeleton = computed(() => props.loading && props.groups.length === 0)

  // Don't render the grid at all when there's nothing to show — otherwise the
  // empty wrapper still consumes a flex gap from the parent container.
  const hasContent = computed(() => showSkeleton.value || props.groups.length > 0)
</script>

<template>
  <div v-if="hasContent" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <template v-if="showSkeleton">
      <SubmissionQuotaGroupSkeleton
        v-for="i in skeletonCount"
        :key="`skeleton-${i}`"
        :accent="accentFor(i - 1)"
      />
    </template>
    <template v-else>
      <SubmissionQuotaGroup
        v-for="(g, i) in groups"
        :key="g.id"
        :group="g"
        :accent="accentFor(i)"
      />
    </template>
  </div>
</template>
