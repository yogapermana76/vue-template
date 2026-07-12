<script setup lang="ts">
  import { computed } from 'vue'
  import { CalendarClock, Ticket } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { Checkbox } from '@/components/ui/checkbox'
  import type { ScanTicketItem } from '@/types/services'
  import { formatVisit } from '../utils/format'

  const props = defineProps<{
    ticket: ScanTicketItem
    variant: 'unclaimed' | 'claimed'
    selected?: boolean
  }>()

  const emit = defineEmits<{
    toggle: [code: string]
  }>()

  const isSelectable = computed(() => props.variant === 'unclaimed' && props.ticket.Claimable)

  const rowClass = computed(() => {
    if (props.variant === 'claimed') {
      return 'border-neutral-200 bg-neutral-50/60'
    }
    if (isSelectable.value && props.selected) {
      return 'border-primary-300 bg-primary-50/50'
    }
    if (isSelectable.value) {
      return 'border-success-200 bg-success-50/40'
    }
    return 'border-neutral-200 bg-neutral-50/60'
  })

  const visit = computed(() => formatVisit(props.ticket))
</script>

<template>
  <li :class="['flex items-start gap-3 rounded-md border p-3', rowClass]">
    <!-- Placeholder in the else branch keeps row alignment when not selectable. -->
    <Checkbox
      v-if="isSelectable"
      :checked="selected"
      class="mt-0.5 shrink-0"
      @update:checked="emit('toggle', ticket.TicketCode)"
    />
    <span
      v-else
      aria-hidden="true"
      class="mt-1 flex size-4 shrink-0 items-center justify-center rounded-sm border border-neutral-300 bg-neutral-100"
    />

    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="body-m-semibold truncate text-neutral-950">
            {{ ticket.Fullname || '—' }}
          </p>
          <p class="body-caption truncate font-mono text-neutral-500">
            {{ ticket.TicketCode }}
          </p>
        </div>

        <Badge v-if="variant === 'claimed'" variant="neutral-soft"> Sudah Digunakan </Badge>
        <Badge v-else :variant="ticket.Claimable ? 'success' : 'neutral-soft'">
          {{ ticket.Claimable ? 'Bisa Klaim' : 'Belum Bisa' }}
        </Badge>
      </div>

      <div v-if="ticket.TicketType || visit" class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span
          v-if="ticket.TicketType"
          class="body-caption inline-flex items-center gap-1.5 text-neutral-600"
        >
          <Ticket class="size-3 shrink-0 text-neutral-400" />
          {{ ticket.TicketType }}
        </span>
        <span
          v-if="visit"
          class="body-caption inline-flex items-center gap-1.5 text-neutral-600 tabular-nums"
        >
          <CalendarClock class="size-3 shrink-0 text-neutral-400" />
          {{ visit }}
        </span>
      </div>
    </div>
  </li>
</template>
