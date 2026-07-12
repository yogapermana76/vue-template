<script setup lang="ts">
  import { Ticket } from 'lucide-vue-next'
  import { SectionHeader } from '@/components/shared'
  import VoucherQuantitySelector from './VoucherQuantitySelector.vue'
  import type { VoucherCategory } from '../types'

  defineProps<{
    categories: VoucherCategory[]
    quantities: Record<string, number>
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:quantity': [categoryId: string, value: number]
  }>()

  const onUpdate = (id: string, value: number) => emit('update:quantity', id, value)
</script>

<template>
  <section class="flex flex-col gap-3">
    <SectionHeader title="Detail Request Voucher" :icon="Ticket" size="md" />

    <div class="flex flex-col gap-2.5">
      <VoucherQuantitySelector
        v-for="category in categories"
        :key="category.id"
        :label="category.label"
        :model-value="quantities[category.id] ?? 0"
        :quota="category.quota"
        :disabled="disabled"
        @update:model-value="value => onUpdate(category.id, value)"
      />
    </div>
  </section>
</template>
