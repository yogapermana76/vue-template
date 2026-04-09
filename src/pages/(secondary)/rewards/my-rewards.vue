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
  <div class="bg-primary-400 flex h-full flex-col">
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

      <SwipeableTabPanels class="bg-white">
        <!-- History Tab -->
        <SwipeableTabPanel value="history">
          <div class="flex flex-col gap-4 px-4 pt-4 pb-4">
            <RewardsRiwayatSection />
          </div>
        </SwipeableTabPanel>

        <!-- Voucher Tab -->
        <SwipeableTabPanel value="voucher">
          <div class="flex flex-col gap-4 px-4 pt-4 pb-4">
            <RewardsVoucherSection />
          </div>
        </SwipeableTabPanel>

        <!-- Lottery Coupons Tab -->
        <SwipeableTabPanel value="lottery-coupons">
          <div class="flex flex-col gap-4 px-4 pt-4 pb-4">
            <RewardsKuponSection />
          </div>
        </SwipeableTabPanel>

        <!-- Items Tab -->
        <SwipeableTabPanel value="items">
          <div class="flex flex-col gap-4 px-4 pt-4 pb-4">
            <RewardsBarangSection />
          </div>
        </SwipeableTabPanel>
      </SwipeableTabPanels>
    </SwipeableTabs>
  </div>
</template>
