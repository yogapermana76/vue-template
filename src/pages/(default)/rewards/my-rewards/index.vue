<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useQueryClient } from '@tanstack/vue-query'
  import { Header } from '@/components/layout'
  import {
    SwipeableTabs,
    SwipeableTabBar,
    SwipeableTabPanels,
    SwipeableTabPanel,
    type TabItem,
  } from '@/components/ui/swipeable-tabs'
  import { Badge } from '@/components/ui/badge'
  import {
    RewardsVouchersSection,
    RewardsLotteryCouponsSection,
    RewardsItemsSection,
  } from '@/components/rewards/sections'
  import {
    useVoucherPagesInfinite,
    useVoucherCategoryFilter,
    useUserLotteryListInfinite,
    useUserGiftInstantlyInfinite,
    voucherKeys,
    lotteryKeys,
    rewardKeys,
  } from '@/composables/services'
  import { PullToRefresh } from '@/components/shared'
  import { usePullToRefresh } from '@/composables/ui'

  definePage({
    meta: {
      title: 'Rewards Saya',
    },
  })

  const queryClient = useQueryClient()

  // Main tabs
  const mainTabs: TabItem[] = [
    { key: 'voucher', label: 'Voucher' },
    { key: 'lottery-coupons', label: 'Kupon Undian' },
    { key: 'items', label: 'Barang' },
  ]

  const activeTab = ref('voucher')

  // Use shared voucher category filter state
  const { categoryIdForApi } = useVoucherCategoryFilter()

  // Fetch totals for badge counts (using size: 1 to minimize data fetch)
  // categoryIdForApi is reactive, so badge count will update when category changes
  // placeholderData: keepPreviousData ensures badge doesn't disappear while loading
  const { total: voucherBadgeCount } = useVoucherPagesInfinite({
    query: { size: 1, categoryId: categoryIdForApi },
  })
  const { total: lotteryCouponsBadgeCount } = useUserLotteryListInfinite({
    query: { size: 1 },
  })
  const { total: itemsBadgeCount } = useUserGiftInstantlyInfinite({
    query: { size: 1 },
  })

  // Format badge count: max 2 digits, >99 shows "99+"
  const formatBadgeCount = (count: number): string => {
    return count > 99 ? '99+' : String(count)
  }

  // Computed badge display values
  const voucherBadgeDisplay = computed(() => formatBadgeCount(voucherBadgeCount.value ?? 0))
  const lotteryCouponsBadgeDisplay = computed(() =>
    formatBadgeCount(lotteryCouponsBadgeCount.value ?? 0),
  )
  const itemsBadgeDisplay = computed(() => formatBadgeCount(itemsBadgeCount.value ?? 0))

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: voucherKeys.pages() }),
        queryClient.invalidateQueries({ queryKey: voucherKeys.categories() }),
        queryClient.invalidateQueries({ queryKey: lotteryKeys.userList() }),
        queryClient.invalidateQueries({ queryKey: rewardKeys.userGiftInstantly() }),
      ])
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <!-- Header -->
  <Header title="Rewards Saya" positioning="fixed" />

  <!-- Swipeable Tabs -->
  <SwipeableTabs v-model="activeTab" :tabs="mainTabs" height-offset="3rem">
    <SwipeableTabBar v-slot="{ tab }">
      {{ tab.label }}
      <Badge
        v-if="tab.key === 'voucher' && voucherBadgeCount > 0"
        variant="destructive"
        class="body-small-semibold size-4 p-0 text-white"
      >
        {{ voucherBadgeDisplay }}
      </Badge>
      <Badge
        v-if="tab.key === 'lottery-coupons' && lotteryCouponsBadgeCount > 0"
        variant="destructive"
        class="body-small-semibold size-4 p-0 text-white"
      >
        {{ lotteryCouponsBadgeDisplay }}
      </Badge>
      <Badge
        v-if="tab.key === 'items' && itemsBadgeCount > 0"
        variant="destructive"
        class="body-small-semibold size-4 p-0 text-white"
      >
        {{ itemsBadgeDisplay }}
      </Badge>
    </SwipeableTabBar>

    <SwipeableTabPanels>
      <!-- Voucher Tab -->
      <SwipeableTabPanel value="voucher" no-padding lazy>
        <RewardsVouchersSection />
      </SwipeableTabPanel>

      <!-- Lottery Coupons Tab -->
      <SwipeableTabPanel value="lottery-coupons" no-padding lazy>
        <RewardsLotteryCouponsSection />
      </SwipeableTabPanel>

      <!-- Items Tab -->
      <SwipeableTabPanel value="items" no-padding lazy>
        <RewardsItemsSection />
      </SwipeableTabPanel>
    </SwipeableTabPanels>
  </SwipeableTabs>
</template>
