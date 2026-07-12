<script setup lang="ts">
  import { computed } from 'vue'
  import { AlertCircle } from 'lucide-vue-next'
  import { EmptyState } from '@/components/ui/empty-state'
  import { DetailField, DetailSection } from '@/components/shared'
  import type { TicketDetail } from '@/types/services'

  const props = defineProps<{
    detail: TicketDetail
  }>()

  const items = computed(() => props.detail.Information ?? [])

  const formatValue = (v: unknown): string => {
    if (Array.isArray(v)) return v.join(', ')
    if (typeof v === 'boolean') return v ? 'Ya' : 'Tidak'
    if (v === null || v === undefined || v === '') return '—'
    return String(v)
  }
</script>

<template>
  <EmptyState
    v-if="!items.length"
    :icon="AlertCircle"
    title="Tidak ada informasi"
    description="Tiket ini tidak memiliki informasi tambahan."
    class="py-8"
  />
  <DetailSection v-else :columns="1" hide-divider>
    <DetailField
      v-for="(item, i) in items"
      :key="`${item.label}-${i}`"
      :label="item.label"
      :value="formatValue(item.value)"
    />
  </DetailSection>
</template>
