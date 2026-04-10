<script setup lang="ts">
  import { computed } from 'vue'
  import { BottomSheet } from '@/components/ui/bottom-sheet'

  interface Coupon {
    id: string
    code: string
    label?: string
  }

  export interface CouponListBottomSheetProps {
    open?: boolean
    coupons?: Coupon[]
  }

  const props = withDefaults(defineProps<CouponListBottomSheetProps>(), {
    open: false,
    coupons: () => [
      { id: '1', code: '123ASDA', label: 'Kupon Undian' },
      { id: '2', code: '778ADSA', label: 'Kupon Undian' },
      { id: '3', code: 'KHJHJK7', label: 'Kupon Undian' },
      { id: '4', code: '9889HHH', label: 'Kupon Undian' },
      { id: '5', code: 'HHJJG87', label: 'Kupon Undian' },
      { id: '6', code: 'HJ7H7H7', label: 'Kupon Undian' },
      { id: '7', code: 'LOW732', label: 'Kupon Undian' },
    ],
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })
</script>

<template>
  <BottomSheet v-model:open="isOpen" title="List Kupon" show-close>
    <div class="flex flex-col gap-3">
      <div v-for="coupon in coupons" :key="coupon.id" class="flex h-6 flex-row items-center gap-2">
        <span class="body-m shrink-0 text-slate-950">{{ coupon.label }}</span>
        <span class="body-l-semibold flex-1 text-right text-slate-950">{{ coupon.code }}</span>
      </div>
    </div>
  </BottomSheet>
</template>
