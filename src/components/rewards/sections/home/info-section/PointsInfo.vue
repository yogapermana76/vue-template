<script setup lang="ts">
  import { ChevronRight, CoinsIcon, Ticket } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { formatNumber } from '@/utils'

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
  <div class="flex flex-col items-start gap-1 self-stretch px-4">
    <!-- Points Label -->
    <p class="body-caption-medium self-stretch text-white">Poin Kamu</p>

    <!-- Points Value and Link -->
    <div class="flex flex-row items-center gap-2 self-stretch">
      <CoinsIcon class="size-4 shrink-0 text-white" />

      <!-- Points Value -->
      <span class="heading-l flex-1 leading-none text-white">{{ formatNumber(points ?? 0) }}</span>

      <Button
        variant="tertiary"
        size="xs"
        layout="iconLeft"
        is-dark-bg
        class="text-primary-300 h-auto w-auto p-0"
        @click="handleViewRewards"
      >
        <Ticket />
        Rewards saya
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
