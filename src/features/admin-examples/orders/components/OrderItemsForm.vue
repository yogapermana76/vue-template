<script setup lang="ts">
  import { Plus, Trash2 } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import { TextField } from '@/components/ui/form'
  import { formatCurrency } from '@/utils/currency'
  import type { OrderItem } from '../types'

  const items = defineModel<OrderItem[]>({ required: true })

  defineProps<{
    totalAmount: number
  }>()

  const emptyItem = (id: number): OrderItem => ({
    id,
    productName: '',
    sku: '',
    qty: 1,
    price: 0,
  })

  const addItem = () => {
    const nextId = Math.max(0, ...items.value.map(i => i.id)) + 1
    items.value = [...items.value, emptyItem(nextId)]
  }

  const removeItem = (id: number) => {
    if (items.value.length <= 1) return
    items.value = items.value.filter(i => i.id !== id)
  }

  const amount = (v: number) => formatCurrency(v, 'USD')
</script>

<template>
  <Card class="overflow-hidden p-0">
    <div class="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
      <h3 class="body-caption-semibold text-primary-700 shrink-0 tracking-widest uppercase">
        Items
      </h3>
      <span class="body-caption text-muted-foreground">· {{ items.length }} total</span>
      <div class="h-px flex-1 bg-neutral-100" />
      <Button variant="tertiary" size="xs" @click="addItem">
        <Plus class="size-3.5" />
        Add item
      </Button>
    </div>

    <div class="divide-y divide-neutral-100">
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-[1.5fr_1fr_80px_120px_auto]"
      >
        <TextField v-model="item.productName" label="Product" placeholder="Product name" />
        <TextField v-model="item.sku" label="SKU" placeholder="SKU-000" />
        <TextField v-model.number="item.qty" label="Qty" type="number" />
        <TextField v-model.number="item.price" label="Price" type="number" format="currency" />
        <div class="flex items-end justify-end">
          <Button
            variant="tertiary"
            size="sm"
            layout="iconOnly"
            :disabled="items.length <= 1"
            @click="removeItem(item.id)"
          >
            <Trash2 class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <div
      class="bg-primary-50/50 flex items-center justify-between border-t border-neutral-200 px-6 py-4"
    >
      <span class="body-m-medium text-muted-foreground">Total</span>
      <span class="heading-s text-foreground">{{ amount(totalAmount) }}</span>
    </div>
  </Card>
</template>
