<script setup lang="ts">
  import { Send } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Divider } from '@/components/ui/divider'
  import VoucherProgramSummary from './VoucherProgramSummary.vue'
  import VoucherDetailSection from './VoucherDetailSection.vue'
  import VoucherTotalCard from './VoucherTotalCard.vue'
  import type { TicketCategoryOption, VoucherCategory } from '../types'

  defineProps<{
    programName: string
    ticketCategoryOptions: TicketCategoryOption[]
    categories: VoucherCategory[]
    quantities: Record<string, number>
    total: number
    submitting?: boolean
    disabled?: boolean
  }>()

  const emit = defineEmits<{
    'update:quantity': [categoryId: string, value: number]
    submit: []
  }>()
</script>

<template>
  <!-- Sky gradient (secondary tone) fading to white so CTA + inputs stay legible. -->
  <aside
    class="from-secondary-100 shadow-card flex h-fit w-full flex-col gap-6 rounded-lg border border-slate-200/70 bg-linear-to-b to-white p-6"
  >
    <VoucherProgramSummary
      :program-name="programName"
      :ticket-category-options="ticketCategoryOptions"
      :disabled="disabled || submitting"
    />

    <Divider />

    <VoucherDetailSection
      :categories="categories"
      :quantities="quantities"
      :disabled="disabled || submitting"
      @update:quantity="(id, value) => emit('update:quantity', id, value)"
    />

    <VoucherTotalCard :total="total" />

    <Button
      type="button"
      variant="primary"
      size="lg"
      class="w-full"
      :disabled="disabled || total === 0"
      :loading="submitting"
      @click="emit('submit')"
    >
      <Send class="size-4" />
      <span>Pesan Sekarang</span>
    </Button>
  </aside>
</template>
