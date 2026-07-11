<script setup lang="ts">
  import { computed } from 'vue'
  import { SelectOption } from '@/components/ui/native-select'
  import { SearchInput } from '@/components/shared/search-input'
  import { withAllOption } from '@/utils'
  import { orderPaymentOptions, orderStatusOptions } from '../constants'
  import type { OrderStatusFilter } from '../types'

  const status = defineModel<OrderStatusFilter>({ required: true })
  const payment = defineModel<string>('payment', { default: 'all' })
  const search = defineModel<string>('search', { default: '' })

  const statusOptions = computed(
    () =>
      withAllOption(orderStatusOptions, 'All statuses') as {
        value: OrderStatusFilter
        label: string
      }[],
  )
  const paymentOptions = computed(() => withAllOption(orderPaymentOptions, 'All payments'))
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 px-4 py-3">
    <SearchInput v-model="search" size="sm" placeholder="Search orders…" class="w-64 shrink-0" />

    <div class="min-w-0 flex-1" />

    <div class="w-40 shrink-0">
      <SelectOption v-model="status" :options="statusOptions" placeholder="Status" />
    </div>
    <div class="w-40 shrink-0">
      <SelectOption v-model="payment" :options="paymentOptions" placeholder="Payment" />
    </div>
  </div>
</template>
