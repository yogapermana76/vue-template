<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { RightSheet } from '@/components/ui/side-sheet'
  import { Spinner } from '@/components/ui/spinner'
  import { EmptyState } from '@/components/ui/empty-state'
  import { AlertCircle } from 'lucide-vue-next'
  import { useNavStack } from '@/composables/ui'
  import type { TicketDetail } from '@/types/services'
  import TicketDetailPanel from './TicketDetailPanel.vue'
  import TicketInfoPanel from './TicketInfoPanel.vue'
  import TicketVisitorFormPanel from './TicketVisitorFormPanel.vue'

  type View = 'detail' | 'info' | 'edit'

  const props = defineProps<{
    open: boolean
    detail: TicketDetail | undefined
    loading?: boolean
    /** Program that owns the ticket — required to fetch the edit form. */
    programId?: number
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const nav = useNavStack<View>('detail')

  const onFormSaved = () => nav.pop()

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
    get: () => nav.isMounted('info'),
    set: v => {
      if (!v && nav.current.value === 'info') nav.pop()
    },
  })

  const editOpen = computed({
    get: () => nav.isMounted('edit'),
    set: v => {
      if (!v && nav.current.value === 'edit') nav.pop()
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

    <TicketDetailPanel v-else :detail="detail" @go-to-info="nav.push('info')" />

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
      <TicketInfoPanel :detail="detail" @go-to-edit="nav.push('edit')" />

      <RightSheet
        v-model:open="editOpen"
        title="Edit Data Pengunjung"
        width="md"
        header-variant="tinted"
        content-slot-class="!p-0"
        show-back
        :show-close="false"
        nested
        @back="nav.pop"
      >
        <TicketVisitorFormPanel
          :program-id="programId"
          :code="detail.TicketCode"
          :active="editOpen"
          @saved="onFormSaved"
        />
      </RightSheet>
    </RightSheet>
  </RightSheet>
</template>
