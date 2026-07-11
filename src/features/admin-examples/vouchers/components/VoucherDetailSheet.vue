<script setup lang="ts">
  import { computed } from 'vue'
  import { Pencil } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { DetailField, DetailSection, DetailSheet } from '@/components/ui/side-sheet'
  import { formatCurrency } from '@/utils/currency'
  import { formatDate } from '@/utils/date'
  import { voucherKindLabel } from '../constants'
  import type { Voucher } from '../types'
  import VoucherStatusBadge from './VoucherStatusBadge.vue'

  const props = defineProps<{
    open: boolean
    voucher: Voucher | null
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    edit: [voucher: Voucher]
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const close = () => (openModel.value = false)

  const money = (v: number) => formatCurrency(v, 'USD')
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const usagePct = computed(() => {
    if (!props.voucher || !props.voucher.usageLimit) return 0
    return Math.min(100, Math.round((props.voucher.usageCount / props.voucher.usageLimit) * 100))
  })

  const valueLabel = computed(() => {
    if (!props.voucher) return '—'
    if (props.voucher.kind === 'percentage') return `${props.voucher.amount}% off`
    if (props.voucher.kind === 'shipping') return 'Free shipping'
    return money(props.voucher.amount)
  })
</script>

<template>
  <DetailSheet
    v-model:open="openModel"
    :title="voucher?.code"
    :subtitle="voucher?.description"
    width="md"
  >
    <template v-if="voucher" #badges>
      <VoucherStatusBadge :status="voucher.status" />
    </template>

    <template v-if="voucher">
      <DetailSection title="Overview">
        <DetailField label="Voucher ID" :value="voucher.id" />
        <DetailField label="Type" :value="voucherKindLabel[voucher.kind]" />
        <DetailField label="Value">
          <span class="body-m-semibold">{{ valueLabel }}</span>
        </DetailField>
        <DetailField label="Minimum spend" :value="money(voucher.minSpend)" />
      </DetailSection>

      <DetailSection title="Usage" :columns="1">
        <DetailField label="Redemptions" wide>
          <div class="flex items-center justify-between gap-3">
            <span class="body-m-semibold text-foreground">
              {{ voucher.usageCount }} / {{ voucher.usageLimit }}
            </span>
            <span class="body-caption text-muted-foreground">{{ usagePct }}%</span>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div class="bg-primary-500 h-full rounded-full" :style="{ width: `${usagePct}%` }" />
          </div>
        </DetailField>
      </DetailSection>

      <DetailSection title="Schedule">
        <DetailField label="Starts on" :value="date(voucher.startsAt)" />
        <DetailField label="Ends on" :value="date(voucher.endsAt)" />
      </DetailSection>
    </template>

    <template #footer>
      <Button variant="secondary" @click="close">Close</Button>
      <Button v-if="voucher" variant="primary" @click="emit('edit', voucher)">
        <Pencil class="size-4" />
        Edit voucher
      </Button>
    </template>
  </DetailSheet>
</template>
