<script setup lang="ts">
  import { ref } from 'vue'
  import { Printer } from 'lucide-vue-next'
  import { Header } from '@/components/layout'
  import { IconButton } from '@/components/ui/button'
  import {
    SwipeableTabs,
    SwipeableTabBar,
    SwipeableTabPanels,
    SwipeableTabPanel,
    type TabItem,
  } from '@/components/ui/swipeable-tabs'
  import {
    RewardsRiwayatSection,
    RewardsVoucherSection,
    RewardsKuponSection,
    RewardsBarangSection,
  } from '@/components/rewards/sections'

  definePage({
    meta: {
      title: 'My Rewards',
    },
  })

  // Main tabs
  const mainTabs: TabItem[] = [
    { key: 'history', label: 'History' },
    { key: 'voucher', label: 'Voucher' },
    { key: 'lottery-coupons', label: 'Lottery Coupons' },
    { key: 'items', label: 'Items' },
  ]

  const activeTab = ref('history')
  const historyBadgeCount = ref(2)
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header -->
    <Header title="My Rewards" show-back hide-theme-toggle positioning="sticky">
      <template #actions>
        <IconButton variant="tertiary" size="md">
          <Printer class="size-5" />
        </IconButton>
      </template>
    </Header>

    <!-- Swipeable Tabs -->
    <SwipeableTabs v-model="activeTab" :tabs="mainTabs" class="flex-1">
      <SwipeableTabBar v-slot="{ tab }">
        {{ tab.label }}
        <span
          v-if="tab.key === 'history'"
          class="body-small-semibold flex size-3.5 items-center justify-center rounded-full bg-red-500 text-white"
        >
          {{ historyBadgeCount }}
        </span>
      </SwipeableTabBar>

      <SwipeableTabPanels>
        <!-- History Tab -->
        <SwipeableTabPanel value="history" no-padding>
          <RewardsRiwayatSection />
        </SwipeableTabPanel>

        <!-- Voucher Tab -->
        <SwipeableTabPanel value="voucher" no-padding>
          <RewardsVoucherSection />
        </SwipeableTabPanel>

        <!-- Lottery Coupons Tab -->
        <SwipeableTabPanel value="lottery-coupons" no-padding>
          <RewardsKuponSection />
        </SwipeableTabPanel>

        <!-- Items Tab -->
        <SwipeableTabPanel value="items" no-padding>
          <RewardsBarangSection />
        </SwipeableTabPanel>
      </SwipeableTabPanels>
    </SwipeableTabs>
  </div>
</template>
