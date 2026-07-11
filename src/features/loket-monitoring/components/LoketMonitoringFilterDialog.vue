<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { RotateCcw } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { DialogWrapper } from '@/components/ui/dialog/composite'
  import { DateRangePickerField } from '@/components/ui/date-picker'
  import { useIsoDateRange } from '@/composables/ui'
  import { emptyMonitoringFilters, type LoketMonitoringFilters } from '../types'

  const props = defineProps<{
    open: boolean
    /** `state` (not `filters`) — Volar flags `filters` as a Vue 2-era prop name. */
    state: LoketMonitoringFilters
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    apply: [value: LoketMonitoringFilters]
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  // Draft copy — commit on Apply, discard on cancel.
  const draft = ref<LoketMonitoringFilters>({ ...props.state })
  watch(
    () => props.state,
    v => {
      draft.value = { ...v }
    },
  )
  watch(openModel, isOpen => {
    if (isOpen) draft.value = { ...props.state }
  })

  const orderRange = useIsoDateRange(
    () => draft.value.orderStartDate,
    () => draft.value.orderEndDate,
    (start, end) => {
      draft.value.orderStartDate = start
      draft.value.orderEndDate = end
    },
  )

  const claimedRange = useIsoDateRange(
    () => draft.value.claimedStartDate,
    () => draft.value.claimedEndDate,
    (start, end) => {
      draft.value.claimedStartDate = start
      draft.value.claimedEndDate = end
    },
  )

  // Reset touches only the draft; parent state stays until Apply commits.
  const onReset = () => {
    draft.value = emptyMonitoringFilters()
  }

  const onApply = () => emit('apply', { ...draft.value })
</script>

<template>
  <DialogWrapper
    v-model:open="openModel"
    title="Filter Data"
    size="md"
    body-class="px-5 pb-5 pt-2"
    header-class="px-5"
  >
    <div class="flex flex-col gap-5">
      <p class="body-caption text-neutral-600">Persempit data monitoring sesuai kebutuhan.</p>

      <DateRangePickerField
        v-model="orderRange"
        label="Waktu Pemesanan"
        placeholder="Pilih rentang waktu pemesanan"
      />

      <DateRangePickerField
        v-model="claimedRange"
        label="Waktu Check In"
        placeholder="Pilih rentang waktu check-in"
      />
    </div>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <Button variant="secondary" size="md" @click="onReset">
          <RotateCcw class="size-4" />
          Reset
        </Button>
        <Button variant="primary" size="md" @click="onApply">Simpan</Button>
      </div>
    </template>
  </DialogWrapper>
</template>
