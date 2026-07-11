<script setup lang="ts">
  import { computed } from 'vue'
  import type { QuotaGroup } from '../../types'
  import SubmissionQuotaBucket from './SubmissionQuotaBucket.vue'
  import SubmissionQuotaGroupIdentity from './SubmissionQuotaGroupIdentity.vue'
  import SubmissionQuotaProgress from './SubmissionQuotaProgress.vue'

  const props = defineProps<{
    group: QuotaGroup
    accent?: 'primary' | 'secondary'
  }>()

  // Dark tonal gradient — uses design-system tokens (primary=teal, secondary=sky).
  const surface = computed(() =>
    props.accent === 'secondary'
      ? 'from-secondary-900 via-secondary-800 to-secondary-950'
      : 'from-primary-900 via-primary-800 to-primary-950',
  )
</script>

<template>
  <section
    :class="[
      'relative overflow-hidden rounded-lg bg-linear-to-br p-5 text-white shadow-sm',
      surface,
    ]"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-16 -right-14 size-52 rounded-full bg-white/10 blur-3xl"
    />

    <div class="relative flex flex-col gap-4">
      <header class="flex items-start justify-between gap-4">
        <SubmissionQuotaGroupIdentity :name="group.name" :used="group.used" :total="group.total" />
        <SubmissionQuotaProgress :used="group.used" :total="group.total" />
      </header>

      <!-- Fill-space grid: 2 col on narrow, up to 3 col from sm+.
           Last row items stretch to fill remaining width so no ragged gaps. -->
      <div class="flex flex-wrap gap-2.5">
        <SubmissionQuotaBucket
          v-for="bucket in group.buckets"
          :key="bucket.id"
          :label="bucket.label"
          :used="bucket.used"
          :total="group.total"
          class="min-w-0 flex-1 basis-[calc((100%-0.625rem)/2)] sm:basis-[calc((100%-1.25rem)/3)]"
        />
      </div>
    </div>
  </section>
</template>
