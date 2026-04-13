<script setup lang="ts">
  import { ref } from 'vue'
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

  definePage({
    meta: {
      title: 'Rewards Saya',
    },
  })

  // Main tabs
  const mainTabs: TabItem[] = [
    { key: 'voucher', label: 'Voucher' },
    { key: 'lottery-coupons', label: 'Kupon Undian' },
    { key: 'items', label: 'Barang' },
  ]

  const activeTab = ref('voucher')
  const voucherBadgeCount = ref(2)
  const lotteryCouponsBadgeCount = ref(2)
  const itemsBadgeCount = ref(2)
</script>

<template>
  <!-- Header -->
  <Header title="Rewards Saya" positioning="sticky" />

  <!-- Swipeable Tabs -->
  <SwipeableTabs v-model="activeTab" :tabs="mainTabs" height-offset="3rem">
    <SwipeableTabBar v-slot="{ tab }">
      {{ tab.label }}
      <Badge
        v-if="tab.key === 'voucher'"
        variant="destructive"
        class="body-small-semibold size-3.5 p-0 text-white"
      >
        {{ voucherBadgeCount }}
      </Badge>
      <Badge
        v-if="tab.key === 'lottery-coupons'"
        variant="destructive"
        class="body-small-semibold size-3.5 p-0 text-white"
      >
        {{ lotteryCouponsBadgeCount }}
      </Badge>
      <Badge
        v-if="tab.key === 'items'"
        variant="destructive"
        class="body-small-semibold size-3.5 p-0 text-white"
      >
        {{ itemsBadgeCount }}
      </Badge>
    </SwipeableTabBar>

    <SwipeableTabPanels>
      <!-- Voucher Tab -->
      <SwipeableTabPanel value="voucher" no-padding>
        <RewardsVouchersSection />
      </SwipeableTabPanel>

      <!-- Lottery Coupons Tab -->
      <SwipeableTabPanel value="lottery-coupons" no-padding>
        <RewardsLotteryCouponsSection />
      </SwipeableTabPanel>

      <!-- Items Tab -->
      <SwipeableTabPanel value="items" no-padding>
        <RewardsItemsSection />
      </SwipeableTabPanel>
    </SwipeableTabPanels>
  </SwipeableTabs>
</template>
