<script setup lang="ts">
  import { computed } from 'vue'
  import { Calendar } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { formatDateInTZ } from '@/utils/date'
  import { SUBMISSION_STATUS_META } from '../../constants'
  import type { SubmissionDetail } from '../../types'

  const props = defineProps<{
    detail: SubmissionDetail
  }>()

  const meta = computed(() => SUBMISSION_STATUS_META[props.detail.status])
</script>

<template>
  <div
    class="from-primary-50 via-primary-50/70 relative overflow-hidden bg-linear-to-br to-white px-5 py-5"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-white/60 blur-3xl"
    />

    <div class="relative flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-col gap-1">
        <span class="body-caption-medium tracking-wide text-neutral-600">Status Pengajuan</span>
        <Badge :variant="meta.badgeVariant" class="w-fit px-3! py-1!">
          {{ meta.label }}
        </Badge>
      </div>
      <div class="text-right">
        <p class="text-xxs font-semibold tracking-wider text-neutral-500 uppercase">ID Pengajuan</p>
        <p class="body-l-semibold font-mono text-neutral-950">{{ detail.id }}</p>
        <p class="body-caption mt-1 inline-flex items-center gap-1 text-neutral-600 tabular-nums">
          <Calendar class="size-3" />
          {{ formatDateInTZ(detail.submittedAt, 'dd-MM-yyyy HH:mm') }}
        </p>
      </div>
    </div>
  </div>
</template>
