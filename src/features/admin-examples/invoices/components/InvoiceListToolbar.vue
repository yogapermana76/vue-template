<script setup lang="ts">
  import { computed } from 'vue'
  import { SelectOption } from '@/components/ui/native-select'
  import { SearchInput } from '@/components/shared/search-input'
  import { withAllOption } from '@/utils'
  import { invoiceStatusOptions } from '../constants'
  import type { InvoiceStatusFilter } from '../types'

  const status = defineModel<InvoiceStatusFilter>({ required: true })
  const search = defineModel<string>('search', { default: '' })

  const statusOptions = computed(
    () =>
      withAllOption(invoiceStatusOptions, 'All statuses') as {
        value: InvoiceStatusFilter
        label: string
      }[],
  )
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 px-4 py-3">
    <SearchInput v-model="search" size="sm" placeholder="Search invoices…" class="w-64 shrink-0" />

    <div class="min-w-0 flex-1" />

    <div class="w-40 shrink-0">
      <SelectOption v-model="status" :options="statusOptions" placeholder="Status" />
    </div>
  </div>
</template>
