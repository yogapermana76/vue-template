<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ChevronRight, CoinsIcon, History } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  const points = ref(0)
  const activeUntil = ref('30 Dec 2026')

  const router = useRouter()

  const handleViewHistory = () => {
    router.push('/eco-journey-points/history')
  }
</script>

<template>
  <div class="flex flex-col gap-5 px-4 pb-5">
    <!-- Points Info -->
    <div class="flex flex-col items-start gap-1 self-stretch">
      <!-- Points Label -->
      <p class="body-caption-medium self-stretch text-white">Poin anda</p>

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
          @click="handleViewHistory"
        >
          <History />
          Riwayat
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
  </div>
</template>
