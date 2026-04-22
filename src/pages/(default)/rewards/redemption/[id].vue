<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRouter } from 'vue-router'
  import { useQueryClient } from '@tanstack/vue-query'
  import { Header, Footer, GradientSection } from '@/components/layout'
  import { Button } from '@/components/ui/button'
  import { RewardsRedemptionDetailsSection } from '@/components/rewards'
  import { RewardDetailSkeleton } from '@/components/rewards/sections'
  import { useExchangePointDetail, rewardKeys } from '@/composables/services'
  import { PullToRefresh } from '@/components/shared'
  import { usePullToRefresh } from '@/composables/ui'
  import CheckIcon from '@/assets/illustrations/check.png?component'

  definePage({
    meta: {
      title: 'Detail Penukaran',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Get tUserPointId from route params
  const tUserPointId = computed(() => {
    const params = route.params as { id?: string }
    return params.id || ''
  })

  // Fetch exchange point detail
  const { data: exchangePointDetail, isPending } = useExchangePointDetail({
    params: { tUserPointId },
  })

  const handleViewReward = () => {
    // Navigate to my rewards page
    router.replace('/rewards/my-rewards')
  }

  const handleBackToHome = () => {
    router.replace('/')
  }

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await queryClient.invalidateQueries({
        queryKey: rewardKeys.exchangePointDetail(tUserPointId.value),
      })
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <!-- Header -->
  <Header title="Detail Penukaran" positioning="fixed" :transparent="!isPending" />

  <!-- Loading State -->
  <template v-if="isPending">
    <RewardDetailSkeleton />
  </template>

  <!-- Loaded State -->
  <template v-else>
    <!-- Hero Section -->
    <GradientSection gradient="cyan" class="items-center pb-12">
      <!-- Success Content Container -->
      <div class="flex flex-col items-center gap-4 px-4">
        <!-- Check Icon -->
        <div class="size-20 shrink-0">
          <CheckIcon class="size-full" />
        </div>

        <!-- Text Container -->
        <div class="flex flex-col items-center gap-1">
          <!-- Title -->
          <h1 class="heading-s text-center text-white">Penukaran Berhasil</h1>

          <!-- Subtitle -->
          <p class="body-m text-center text-white opacity-90">
            Penukaran yang anda lakukan telah berhasil
          </p>
        </div>
      </div>
    </GradientSection>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col gap-5 pb-36">
      <RewardsRedemptionDetailsSection :data="exchangePointDetail?.data" />
    </main>

    <!-- Footer with Buttons -->
    <Footer position="fixed">
      <Button variant="primary" size="md" class="w-full" @click="handleViewReward">
        Lihat Reward
      </Button>
      <Button
        variant="secondary"
        size="md"
        class="border-primary-600/50 text-primary-700 w-full"
        @click="handleBackToHome"
      >
        Kembali ke Beranda
      </Button>
    </Footer>
  </template>
</template>
