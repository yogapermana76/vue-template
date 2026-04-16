<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { ChevronRight, CoinsIcon, Ticket } from 'lucide-vue-next'
  import { WinnerInfoCard } from '@/components/rewards'
  import { Button } from '@/components/ui/button'
  import { usePointSummary, useWinnersCategory } from '@/composables/services'

  const router = useRouter()

  // Fetch point summary
  const { data: pointSummary } = usePointSummary()

  // Fetch winners category
  const { data: winnersCategory } = useWinnersCategory()

  // Debug: log data on change
  watch(pointSummary, val => {
    // eslint-disable-next-line no-console
    console.log('Point Summary:', val)
  })

  // Debug: log data on change
  watch(winnersCategory, val => {
    // eslint-disable-next-line no-console
    console.log('Winners Category:', val)
  })

  const points = ref(0)
  const activeUntil = ref('30 Dec 2026')

  const handleViewRewards = () => {
    router.push('/rewards/my-rewards')
  }

  const handleViewWinners = () => {
    router.push('/rewards/winners')
  }
</script>

<template>
  <div class="flex flex-col gap-5 px-4 pb-5">
    <!-- Points Info -->
    <div class="flex flex-col items-start gap-1 self-stretch">
      <!-- Points Label -->
      <p class="body-caption-medium self-stretch text-white">Poin Kamu</p>

      <!-- Points Value and Link -->
      <div class="flex flex-row items-center gap-2 self-stretch">
        <CoinsIcon class="size-4 shrink-0 text-white" />
        <span class="heading-l flex-1 leading-none text-white">{{ points }}</span>

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

    <!-- Active Until -->
    <div
      class="body-caption-semibold flex flex-row items-center justify-between gap-1 self-stretch rounded-full bg-[#061D2B] px-4 py-2 text-white backdrop-blur-md"
    >
      <span>Aktif sampai</span>
      <span>{{ activeUntil }}</span>
    </div>

    <!-- Winner Info Card -->
    <WinnerInfoCard @click="handleViewWinners" />
  </div>
</template>
