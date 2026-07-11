<script setup lang="ts">
  import type { LoketTicketDetail } from '@/types/services/loket'
  import TicketVisitorSection from './detail/TicketVisitorSection.vue'
  import TicketBuyerSection from './detail/TicketBuyerSection.vue'
  import TicketTimeSection from './detail/TicketTimeSection.vue'

  defineProps<{ detail: LoketTicketDetail }>()

  const emit = defineEmits<{ 'go-to-info': [] }>()
</script>

<template>
  <div class="flex flex-col">
    <TicketVisitorSection :detail="detail" @go-to-info="emit('go-to-info')" />
    <TicketBuyerSection :detail="detail" />
    <TicketTimeSection :detail="detail" />
  </div>
</template>
