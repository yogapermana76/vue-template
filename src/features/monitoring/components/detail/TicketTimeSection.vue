<script setup lang="ts">
  import { computed } from 'vue'
  import { DetailField, DetailSection } from '@/components/shared'
  import type { TicketDetail } from '@/types/services'
  import { fmtDateTimeInTZ, fmtVisitWindow, orDash } from '../../utils/detailFormatters'

  const props = defineProps<{ detail: TicketDetail }>()

  const orderDate = computed(() => fmtDateTimeInTZ(props.detail.OrderDate, props.detail.Timezone))
  const claimedAt = computed(() => fmtDateTimeInTZ(props.detail.ClaimedAt, props.detail.Timezone))
  const validityPeriod = computed(() =>
    fmtVisitWindow(
      props.detail.StartVisitDate,
      props.detail.StartVisitTime,
      props.detail.EndVisitDate,
      props.detail.EndVisitTime,
      props.detail.Timezone,
    ),
  )
</script>

<template>
  <DetailSection title="Waktu">
    <DetailField label="Waktu Pemesanan">
      <span class="tabular-nums">{{ orderDate }}</span>
    </DetailField>
    <DetailField label="Waktu Check In">
      <span class="tabular-nums">{{ claimedAt }}</span>
    </DetailField>
    <DetailField v-if="detail.UpdatedBy" label="Di Update oleh" :value="orDash(detail.UpdatedBy)" />
    <DetailField label="Tanggal Berlaku Tiket" wide>
      <span class="tabular-nums">{{ validityPeriod }}</span>
    </DetailField>
  </DetailSection>
</template>
