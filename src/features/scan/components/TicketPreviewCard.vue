<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Search, Ticket } from 'lucide-vue-next'
  import { Card, CardContent } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { SearchInput } from '@/components/shared'
  import type { ScanResult } from '@/types/services'
  import { useTicketSelection } from '../composables/useTicketSelection'
  import { PREVIEW_LIMIT } from '../composables/useTicketListView'
  import ScanOrderSummary from './ScanOrderSummary.vue'
  import ScanTicketList from './ScanTicketList.vue'

  const props = defineProps<{
    scanResult: ScanResult
    selectedCodes?: string[]
  }>()

  const emit = defineEmits<{
    'update:selectedCodes': [codes: string[]]
  }>()

  const selection = useTicketSelection({
    scanResult: () => props.scanResult,
    getSelected: () => props.selectedCodes ?? [],
    setSelected: codes => emit('update:selectedCodes', codes),
  })

  const query = ref('')

  // Bulk toggle respects active search — don't touch selections outside the filter.
  const filteredClaimableCodes = computed(() => {
    const q = query.value.trim().toLowerCase()
    return selection.claimableTickets.value
      .filter(
        t =>
          !q ||
          t.Fullname?.toLowerCase().includes(q) === true ||
          t.TicketCode.toLowerCase().includes(q),
      )
      .map(t => t.TicketCode)
  })
  const allFilteredSelected = computed(() => selection.isAllSelected(filteredClaimableCodes.value))
  const bulkToggle = () => selection.toggleAll(filteredClaimableCodes.value)

  const order = computed(() => props.scanResult.Order)

  const totalTickets = computed(
    () => selection.unclaimed.value.length + selection.claimed.value.length,
  )
  const showSearch = computed(() => totalTickets.value > PREVIEW_LIMIT)

  const heroAccent = computed(() =>
    selection.hasClaimable.value
      ? 'from-success-500/10 via-white to-white border-success-100'
      : 'from-warning-500/10 via-white to-white border-warning-100',
  )

  const statusBadge = computed<{
    variant: 'success' | 'warning-soft' | 'error-soft'
    label: string
  }>(() => {
    if (selection.hasClaimable.value) return { variant: 'success', label: 'Dapat Diklaim' }
    if (selection.unclaimed.value.length === 0 && selection.claimed.value.length > 0) {
      return { variant: 'warning-soft', label: 'Sudah Diklaim' }
    }
    return { variant: 'error-soft', label: 'Belum Dapat Diklaim' }
  })
</script>

<template>
  <Card :class="['overflow-hidden border bg-linear-to-b shadow-xs', heroAccent]">
    <div class="flex items-center gap-4 border-b border-neutral-100 p-5">
      <div
        class="from-primary-500 to-primary-700 flex size-14 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-md"
      >
        <Ticket class="size-7" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="body-caption tracking-wider text-neutral-500 uppercase">Nomor Pesanan</p>
        <p class="body-l-semibold truncate font-mono text-neutral-950">
          {{ order?.OrderNumber ?? '—' }}
        </p>
      </div>
      <Badge :variant="statusBadge.variant">{{ statusBadge.label }}</Badge>
    </div>

    <CardContent class="flex flex-col gap-5 py-5">
      <ScanOrderSummary v-if="order" :order="order" />

      <SearchInput
        v-if="showSearch"
        v-model="query"
        placeholder="Cari nama atau kode tiket..."
        size="sm"
        :prefix-icon="Search"
      />

      <ScanTicketList
        v-if="selection.unclaimed.value.length"
        title="Tiket Belum Diklaim"
        variant="unclaimed"
        :tickets="selection.unclaimed.value"
        :query="query"
        :is-selected="selection.isSelected"
        :all-selected="allFilteredSelected"
        :show-bulk-toggle="filteredClaimableCodes.length > 1"
        @toggle-ticket="selection.toggleTicket"
        @toggle-all="bulkToggle"
      />

      <ScanTicketList
        v-if="selection.claimed.value.length"
        title="Tiket Sudah Diklaim"
        variant="claimed"
        :tickets="selection.claimed.value"
        :query="query"
      />
    </CardContent>
  </Card>
</template>
