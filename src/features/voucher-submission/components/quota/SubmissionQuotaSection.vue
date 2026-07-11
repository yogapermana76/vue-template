<script setup lang="ts">
  import type { QuotaGroup } from '../../types'
  import SubmissionQuotaGroup from './SubmissionQuotaGroup.vue'

  defineProps<{
    groups: QuotaGroup[]
  }>()

  // Alternate accents for visual differentiation; wraps at 2 to keep palette consistent.
  const accentFor = (index: number): 'primary' | 'secondary' =>
    index % 2 === 0 ? 'primary' : 'secondary'
</script>

<template>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <SubmissionQuotaGroup v-for="(g, i) in groups" :key="g.id" :group="g" :accent="accentFor(i)" />
  </div>
</template>
