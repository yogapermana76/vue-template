<script setup lang="ts">
  import { computed } from 'vue'
  import { DetailField, DetailSection } from '@/components/shared'
  import type { TicketDetail } from '@/types/services'
  import { fmtAmount, orDash } from '../../utils/detailFormatters'

  const props = defineProps<{ detail: TicketDetail }>()

  const claimProgress = computed(() => {
    const c = props.detail.ClaimedCount ?? 0
    const total = props.detail.TotalTicket ?? 0
    return total > 0 ? `${c}/${total}` : '—'
  })
</script>

<template>
  <DetailSection title="Detail Pemesan">
    <DetailField label="Nomor Pesanan">
      <span class="font-mono font-semibold">{{ orDash(detail.OrderNumber) }}</span>
    </DetailField>
    <DetailField label="Jumlah Tiket">
      <span class="body-m-semibold tabular-nums">
        {{ claimProgress }}
        <span class="body-caption font-normal text-neutral-500">terklaim</span>
      </span>
    </DetailField>
    <DetailField label="Nama Pemesan" :value="orDash(detail.BuyerName)" />
    <DetailField label="Kontak User">
      <span class="tabular-nums">{{ orDash(detail.BuyerPhone) }}</span>
      <span class="body-caption block break-all text-neutral-600">
        {{ orDash(detail.BuyerEmail) }}
      </span>
    </DetailField>
    <DetailField v-if="detail.Amount !== undefined" label="Nominal" wide>
      <span class="body-m-semibold tabular-nums">{{ fmtAmount(detail.Amount) }}</span>
    </DetailField>
  </DetailSection>
</template>
