<script setup lang="ts">
  import { toRef } from 'vue'
  import { Button } from '@/components/ui/button'
  import type { ScanTicketItem } from '@/types/services'
  import { useTicketListView } from '../composables/useTicketListView'
  import ScanTicketRow from './ScanTicketRow.vue'

  const props = defineProps<{
    title: string
    variant: 'unclaimed' | 'claimed'
    tickets: ScanTicketItem[]
    query: string
    isSelected?: (code: string) => boolean
    allSelected?: boolean
    showBulkToggle?: boolean
    /** Order-level timezone forwarded to rows (for visit-window rendering). */
    orderTz?: string
  }>()

  const emit = defineEmits<{
    'toggle-ticket': [code: string]
    'toggle-all': []
  }>()

  const view = useTicketListView(
    () => props.tickets,
    toRef(() => props.query),
  )
</script>

<template>
  <section class="flex flex-col gap-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h4 class="body-m-semibold text-neutral-950">
        {{ title }}
        <span class="body-caption font-normal text-neutral-500 tabular-nums">
          · {{ view.filtered.value.length }}
        </span>
      </h4>
      <button
        v-if="showBulkToggle && variant === 'unclaimed'"
        type="button"
        class="text-primary-700 hover:text-primary-800 body-caption inline-flex items-center gap-1.5 font-semibold transition"
        @click="emit('toggle-all')"
      >
        {{ allSelected ? 'Batal Pilih Semua' : 'Pilih Semua Bisa Klaim' }}
      </button>
    </div>

    <ul v-if="view.displayed.value.length" class="flex flex-col gap-2">
      <ScanTicketRow
        v-for="t in view.displayed.value"
        :key="t.TicketCode"
        :ticket="t"
        :variant="variant"
        :order-tz="orderTz"
        :selected="variant === 'unclaimed' && isSelected ? isSelected(t.TicketCode) : false"
        @toggle="code => emit('toggle-ticket', code)"
      />
    </ul>

    <p v-else class="body-caption py-4 text-center text-neutral-500">
      Tidak ada tiket yang cocok dengan pencarian.
    </p>

    <Button
      v-if="view.hasOverflow.value"
      variant="tertiary"
      size="sm"
      class="self-center"
      @click="view.toggleShowAll"
    >
      {{
        view.showAll.value
          ? 'Tampilkan lebih sedikit'
          : `Tampilkan semua ${view.filtered.value.length} tiket`
      }}
    </Button>
  </section>
</template>
