<script setup lang="ts">
  import { computed } from 'vue'
  import { Badge } from '@/components/ui/badge'
  import { SUBMISSION_STATUS_META } from '../../constants'
  import type { SubmissionStatus } from '../../types'

  const props = defineProps<{ status: SubmissionStatus }>()

  const meta = computed(() => SUBMISSION_STATUS_META[props.status])
</script>

<template>
  <div class="flex items-center justify-between gap-4 px-5 py-4">
    <span class="body-m-medium text-neutral-700">Status Pengajuan</span>
    <Badge :variant="meta.badgeVariant" class="px-3! py-1!">
      {{ meta.label }}
    </Badge>
  </div>
</template>
