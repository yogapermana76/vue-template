<script setup lang="ts">
  import { ChevronRight } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import PointsDisplay from '@/components/rewards/common/PointsDisplay.vue'
  import VoucherIcon from '@/assets/icons/voucher.svg?component'

  interface PointsInfoProps {
    /** Points value to display */
    points: number
  }

  defineProps<PointsInfoProps>()

  const emit = defineEmits<{
    viewRewards: []
  }>()

  const handleViewRewards = () => {
    emit('viewRewards')
  }
</script>

<template>
  <PointsDisplay :points="points" variant="dark" class="px-4">
    <template #action>
      <Button
        variant="tertiary"
        size="xs"
        layout="iconLeft"
        is-dark-bg
        class="text-primary-300 h-auto w-auto p-0"
        @click="handleViewRewards"
      >
        <VoucherIcon class="size-5!" />
        Rewards saya
        <ChevronRight />
      </Button>
    </template>
  </PointsDisplay>
</template>
