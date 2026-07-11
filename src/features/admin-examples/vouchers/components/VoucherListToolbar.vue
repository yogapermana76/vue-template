<script setup lang="ts">
  import { computed } from 'vue'
  import { SelectOption } from '@/components/ui/native-select'
  import { SearchInput } from '@/components/shared/search-input'
  import { withAllOption } from '@/utils'
  import { voucherKindOptions, voucherStatusOptions } from '../constants'
  import type { VoucherStatusFilter } from '../types'

  const status = defineModel<VoucherStatusFilter>({ required: true })
  const kind = defineModel<string>('kind', { default: 'all' })
  const startFrom = defineModel<string>('startFrom', { default: '' })
  const startTo = defineModel<string>('startTo', { default: '' })
  const search = defineModel<string>('search', { default: '' })

  const statusOptions = computed(
    () =>
      withAllOption(voucherStatusOptions, 'All statuses') as {
        value: VoucherStatusFilter
        label: string
      }[],
  )
  const kindOptions = computed(() => withAllOption(voucherKindOptions, 'All types'))
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 px-4 py-3">
    <SearchInput v-model="search" size="sm" placeholder="Search vouchers…" class="w-64 shrink-0" />

    <div class="min-w-0 flex-1" />

    <div class="w-40 shrink-0">
      <SelectOption v-model="status" :options="statusOptions" placeholder="Status" />
    </div>
    <div class="w-44 shrink-0">
      <SelectOption v-model="kind" :options="kindOptions" placeholder="Type" />
    </div>

    <div class="flex items-center gap-1.5">
      <span class="body-caption text-muted-foreground">From</span>
      <input
        v-model="startFrom"
        type="date"
        class="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900"
      />
      <span class="body-caption text-muted-foreground">to</span>
      <input
        v-model="startTo"
        type="date"
        class="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900"
      />
    </div>
  </div>
</template>
