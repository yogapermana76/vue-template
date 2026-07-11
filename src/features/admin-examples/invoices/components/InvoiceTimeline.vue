<script setup lang="ts">
  import { computed } from 'vue'
  import { Check, FileText, Mail, MessageCircle, Send } from 'lucide-vue-next'
  import { Card } from '@/components/ui/card'
  import { formatDate } from '@/utils/date'
  import type { InvoiceTimelineEvent } from '../types'

  const props = defineProps<{
    events: InvoiceTimelineEvent[]
  }>()

  const sorted = computed(() =>
    [...props.events].sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)),
  )

  const iconFor = (kind: InvoiceTimelineEvent['kind']) => {
    switch (kind) {
      case 'created':
        return FileText
      case 'sent':
        return Send
      case 'paid':
        return Check
      case 'reminder':
        return Mail
      case 'note':
      default:
        return MessageCircle
    }
  }

  const toneFor = (kind: InvoiceTimelineEvent['kind']) => {
    switch (kind) {
      case 'paid':
        return 'bg-success-50 text-success-700'
      case 'sent':
        return 'bg-info-50 text-info-700'
      case 'reminder':
        return 'bg-warning-50 text-warning-700'
      case 'created':
        return 'bg-primary-50 text-primary-700'
      case 'note':
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const fmt = (v: string) => formatDate(v, 'dd MMM yyyy · HH:mm')
</script>

<template>
  <Card class="overflow-hidden p-0">
    <div class="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
      <h3 class="body-caption-semibold text-primary-700 shrink-0 tracking-widest uppercase">
        Activity
      </h3>
      <div class="h-px flex-1 bg-neutral-100" />
    </div>

    <ol class="relative flex flex-col gap-4 px-6 py-5">
      <li v-for="event in sorted" :key="event.id" class="relative flex items-start gap-3">
        <div
          :class="[
            'flex size-8 shrink-0 items-center justify-center rounded-full',
            toneFor(event.kind),
          ]"
        >
          <component :is="iconFor(event.kind)" class="size-4" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="body-m-semibold text-foreground">{{ event.label }}</p>
          <p class="body-caption text-muted-foreground mt-0.5">
            {{ fmt(event.timestamp) }}
            <template v-if="event.actor"> · by {{ event.actor }}</template>
          </p>
          <p v-if="event.note" class="body-caption mt-1 text-neutral-600">{{ event.note }}</p>
        </div>
      </li>
    </ol>
  </Card>
</template>
