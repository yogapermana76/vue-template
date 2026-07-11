<script setup lang="ts">
  import { Mail, Phone, User } from 'lucide-vue-next'
  import { DetailField } from '@/components/shared'
  import type { LoketScanOrderInfo } from '@/types/services/loket'
  import { formatOrderDate, formatPhone } from '../utils/format'

  defineProps<{
    order: LoketScanOrderInfo
  }>()
</script>

<template>
  <section class="grid gap-3 sm:grid-cols-2">
    <DetailField label="Nama Pemesan">
      <span class="inline-flex items-center gap-1.5">
        <User class="size-3.5 shrink-0 text-neutral-500" />
        {{ order.BuyerName || '—' }}
      </span>
    </DetailField>

    <DetailField label="No. HP Pemesan">
      <span class="inline-flex items-center gap-1.5 tabular-nums">
        <Phone class="size-3.5 shrink-0 text-neutral-500" />
        {{ formatPhone(order.BuyerPhone) }}
      </span>
    </DetailField>

    <DetailField v-if="order.BuyerEmail" label="Email Pemesan" wide>
      <span class="inline-flex items-center gap-1.5 break-all">
        <Mail class="size-3.5 shrink-0 text-neutral-500" />
        {{ order.BuyerEmail }}
      </span>
    </DetailField>

    <DetailField label="Kategori" :value="order.TicketCategory || '—'" />

    <DetailField label="Terklaim">
      <span class="tabular-nums">
        {{ order.ClaimedCount ?? 0 }} / {{ order.TotalTicket ?? 0 }}
      </span>
    </DetailField>

    <DetailField label="Waktu Pemesanan">
      <span class="tabular-nums">{{ formatOrderDate(order.OrderDate) }}</span>
    </DetailField>
  </section>
</template>
