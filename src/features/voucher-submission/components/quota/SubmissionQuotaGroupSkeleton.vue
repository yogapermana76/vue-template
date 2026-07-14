<script setup lang="ts">
  import { computed } from 'vue'
  import { Skeleton } from '@/components/ui/skeleton'

  const props = withDefaults(
    defineProps<{
      accent?: 'primary' | 'secondary'
      /** Number of bucket placeholders to render. Matches typical ticket count. */
      buckets?: number
    }>(),
    { accent: 'primary', buckets: 3 },
  )

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
    aria-busy="true"
    aria-live="polite"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-16 -right-14 size-52 rounded-full bg-white/10 blur-3xl"
    />

    <div class="relative flex flex-col gap-4">
      <header class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 flex-col gap-2">
          <Skeleton class="h-5 w-32 bg-white/20" />
          <Skeleton class="h-4 w-20 bg-white/10" />
        </div>
        <Skeleton class="size-14 rounded-full bg-white/20" />
      </header>

      <div class="flex flex-wrap gap-2.5">
        <Skeleton
          v-for="i in buckets"
          :key="i"
          class="h-16 min-w-0 flex-1 basis-[calc((100%-0.625rem)/2)] bg-white/10 sm:basis-[calc((100%-1.25rem)/3)]"
        />
      </div>
    </div>
  </section>
</template>
