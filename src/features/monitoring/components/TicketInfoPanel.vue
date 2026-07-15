<script setup lang="ts">
  import { computed } from 'vue'
  import { AlertCircle } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { EmptyState } from '@/components/ui/empty-state'
  import { DetailField, DetailSection } from '@/components/shared'
  import type { TicketDetail } from '@/types/services'
  import { getVisitorField, orDash } from '../utils/detailFormatters'

  const props = defineProps<{
    detail: TicketDetail
  }>()

  const items = computed(() => props.detail.Information ?? [])

  const fullname = computed(() =>
    getVisitorField(props.detail.Information, 'Fullname', props.detail.Fullname),
  )
  const phone = computed(() =>
    getVisitorField(props.detail.Information, 'PhoneNumber', props.detail.PhoneNumber),
  )
  const email = computed(() =>
    getVisitorField(props.detail.Information, 'Email', props.detail.Email),
  )
  const claimed = computed(() => !!props.detail.Claimed)
  const badgeVariant = computed<'success' | 'warning-soft'>(() =>
    claimed.value ? 'success' : 'warning-soft',
  )
  const badgeLabel = computed(() => (claimed.value ? 'Sudah Digunakan' : 'Belum Digunakan'))

  const formatValue = (v: unknown): string => {
    if (Array.isArray(v)) return v.join(', ')
    if (typeof v === 'boolean') return v ? 'Ya' : 'Tidak'
    if (v === null || v === undefined || v === '') return '—'
    return String(v)
  }
</script>

<template>
  <div class="flex flex-col">
    <DetailSection title="Detail Pengunjung" variant="emphasized">
      <template #action>
        <Badge :variant="badgeVariant">{{ badgeLabel }}</Badge>
      </template>

      <DetailField label="Nama" :value="orDash(fullname)" />
      <DetailField label="Nomor HP">
        <span class="tabular-nums">{{ orDash(phone) }}</span>
      </DetailField>
      <DetailField label="Email" wide>
        <span class="break-all">{{ orDash(email) }}</span>
      </DetailField>
      <DetailField label="Kode Tiket">
        <span class="font-mono font-semibold">{{ orDash(detail.TicketCode) }}</span>
      </DetailField>
      <DetailField label="Kategori" :value="orDash(detail.TicketCategory)" />
      <DetailField label="Tipe Tiket" :value="orDash(detail.TicketType)" wide />
    </DetailSection>

    <DetailSection title="Informasi Tambahan" :columns="1" hide-divider>
      <template v-if="items.length">
        <DetailField
          v-for="(item, i) in items"
          :key="`${item.label}-${i}`"
          :label="item.label"
          :value="formatValue(item.value)"
        />
      </template>
      <EmptyState
        v-else
        :icon="AlertCircle"
        title="Tidak ada informasi"
        description="Tiket ini tidak memiliki informasi tambahan."
        class="py-6"
      />
    </DetailSection>
  </div>
</template>
