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
      <span
        v-if="tab.key === 'voucher'"
        class="body-small-semibold flex size-3.5 items-center justify-center rounded-full bg-red-500 text-white"
      >
        {{ voucherBadgeCount }}
      </span>
      <span
        v-if="tab.key === 'lottery-coupons'"
        class="body-small-semibold flex size-3.5 items-center justify-center rounded-full bg-red-500 text-white"
      >
        {{ lotteryCouponsBadgeCount }}
      </span>
      <span
        v-if="tab.key === 'items'"
        class="body-small-semibold flex size-3.5 items-center justify-center rounded-full bg-red-500 text-white"
      >
        {{ itemsBadgeCount }}
      </span>
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
