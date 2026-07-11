<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { RightSheet } from '@/components/ui/side-sheet'
  import { Spinner } from '@/components/ui/spinner'
  import { EmptyState } from '@/components/ui/empty-state'
  import { AlertCircle } from 'lucide-vue-next'
  import { useNavStack } from '@/composables/ui'
  import type { LoketTicketDetail } from '@/types/services/loket'
  import LoketTicketDetailPanel from './LoketTicketDetailPanel.vue'
  import LoketTicketInfoPanel from './LoketTicketInfoPanel.vue'

  type View = 'detail' | 'info'

  const props = defineProps<{
    open: boolean
    detail: LoketTicketDetail | undefined
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const nav = useNavStack<View>('detail')

  watch(
    () => props.open,
    isOpen => (isOpen ? nav.openRoot() : nav.close()),
    { immediate: true },
  )

  const detailOpen = computed({
    get: () => nav.isMounted('detail'),
    set: v => {
      if (!v) emit('update:open', false)
    },
  })

  const infoOpen = computed({
    get: () => nav.isActive('info'),
    set: v => {
      if (!v) nav.pop()
    },
  })
</script>

<template>
  <RightSheet
    v-model:open="detailOpen"
    title="Detail Tiket"
    width="md"
    header-variant="tinted"
    content-slot-class="!p-0"
  >
    <div v-if="loading" class="flex min-h-64 flex-col items-center justify-center gap-3 py-10">
      <Spinner size="lg" tone="primary" />
      <p class="body-caption text-neutral-500">Memuat detail tiket...</p>
    </div>

    <EmptyState
      v-else-if="!detail"
      :icon="AlertCircle"
      title="Detail tidak ditemukan"
      description="Tidak ada detail untuk tiket ini."
      class="py-6"
    />

    <LoketTicketDetailPanel v-else :detail="detail" @go-to-info="nav.push('info')" />

    <!-- Pushed sheet — only rendered while active; back arrow triggers pop. -->
    <RightSheet
      v-if="detail"
      v-model:open="infoOpen"
      title="Informasi Tambahan"
      width="md"
      header-variant="tinted"
      content-slot-class="!p-0"
      show-back
      :show-close="false"
      nested
      @back="nav.pop"
    >
      <LoketTicketInfoPanel :detail="detail" />
    </RightSheet>
  </RightSheet>
</template>
