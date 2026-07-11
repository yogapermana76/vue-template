<script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronRight } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { DetailField, DetailSection } from '@/components/shared'
  import type { LoketTicketDetail } from '@/types/services/loket'
  import { orDash } from '../../utils/detailFormatters'

  const props = defineProps<{ detail: LoketTicketDetail }>()

  const emit = defineEmits<{ 'go-to-info': [] }>()

  const claimed = computed(() => !!props.detail.Claimed)
  const badgeVariant = computed<'success' | 'warning-soft'>(() =>
    claimed.value ? 'success' : 'warning-soft',
  )
  const badgeLabel = computed(() => (claimed.value ? 'Sudah Digunakan' : 'Belum Digunakan'))
  const hasInformation = computed(() => (props.detail.Information?.length ?? 0) > 0)
</script>

<template>
  <DetailSection title="Detail Pengunjung" variant="emphasized">
    <template #action>
      <Badge :variant="badgeVariant">{{ badgeLabel }}</Badge>
    </template>

    <DetailField label="Nama" :value="orDash(detail.Fullname)" />
    <DetailField label="Nomor HP">
      <span class="tabular-nums">{{ orDash(detail.PhoneNumber) }}</span>
    </DetailField>
    <DetailField label="Email" wide>
      <span class="break-all">{{ orDash(detail.Email) }}</span>
    </DetailField>
    <DetailField label="Kode Tiket">
      <span class="font-mono font-semibold">{{ orDash(detail.TicketCode) }}</span>
    </DetailField>
    <DetailField label="Kategori" :value="orDash(detail.TicketCategory)" />
    <DetailField label="Tipe Tiket" :value="orDash(detail.TicketType)" wide />

    <template v-if="hasInformation" #footer>
      <button
        type="button"
        class="text-info-700 hover:text-info-800 inline-flex items-center gap-1 text-sm font-semibold transition"
        @click="emit('go-to-info')"
      >
        Lihat lebih banyak
        <ChevronRight class="size-4" />
      </button>
    </template>
  </DetailSection>
</template>
