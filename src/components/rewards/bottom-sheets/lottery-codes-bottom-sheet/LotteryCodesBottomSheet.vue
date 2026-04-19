<script setup lang="ts">
  import { BottomSheet } from '@/components/ui/bottom-sheet'

  interface LotteryCode {
    lotteryCode: string
  }

  interface LotteryDetail {
    lotteryCodes?: LotteryCode[]
  }

  defineProps<{
    open: boolean
    lotteryDetail?: LotteryDetail
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>

<template>
  <BottomSheet :open="open" title="List Kupon" @update:open="emit('update:open', $event)">
    <div class="flex flex-col gap-3">
      <div
        v-for="(code, index) in lotteryDetail?.lotteryCodes"
        :key="index"
        class="flex items-center gap-2"
      >
        <span class="body-m text-slate-950">Kupon Undian</span>
        <span class="body-l-semibold flex-1 text-right text-slate-950">{{ code.lotteryCode }}</span>
      </div>
    </div>
  </BottomSheet>
</template>
