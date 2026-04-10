<script setup lang="ts">
  import { computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import { BottomSheet } from '@/components/ui/bottom-sheet'

  export interface ExchangeSummaryBottomSheetProps {
    open?: boolean
    userPoints?: number
    exchangePoints?: number
  }

  const props = withDefaults(defineProps<ExchangeSummaryBottomSheetProps>(), {
    open: false,
    userPoints: 50,
    exchangePoints: 50,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    confirm: []
    cancel: []
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const remainingPoints = computed(() => props.userPoints - props.exchangePoints)

  const handleConfirm = () => {
    emit('confirm')
    isOpen.value = false
  }

  const handleCancel = () => {
    emit('cancel')
    isOpen.value = false
  }
</script>

<template>
  <BottomSheet
    v-model:open="isOpen"
    title="Penukaran Hadiah"
    show-close
    has-footer
    footer-position="sticky"
  >
    <!-- Summary Items -->
    <div class="flex flex-col gap-4">
      <!-- Points Owned -->
      <div class="flex items-center justify-between">
        <span class="body-m-regular text-slate-700">Poin yang dimiliki</span>
        <span class="body-l-semibold text-slate-950">{{ userPoints }}</span>
      </div>

      <!-- Points to Exchange -->
      <div class="flex items-center justify-between">
        <span class="body-m-semibold text-slate-950">Poin yang ditukar</span>
        <span class="body-l-semibold text-slate-950">{{ exchangePoints }}</span>
      </div>

      <!-- Remaining Points Estimate -->
      <div class="flex items-center justify-between">
        <span class="body-m-regular text-slate-700">Estimasi sisa poin</span>
        <span class="body-l-semibold text-slate-950">{{ remainingPoints }}</span>
      </div>
    </div>

    <!-- Footer: Action Buttons -->
    <template #footer>
      <div class="flex w-full gap-3">
        <Button variant="secondary" size="sm" class="flex-1" @click="handleCancel"> Batal </Button>
        <Button variant="primary" size="sm" class="flex-1" @click="handleConfirm">
          Tukar Hadiah
        </Button>
      </div>
    </template>
  </BottomSheet>
</template>
