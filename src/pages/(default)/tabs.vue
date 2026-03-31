<script setup lang="ts">
  import { ref } from 'vue'
  import {
    SwipeableTabs,
    SwipeableTabBar,
    SwipeableTabPanels,
    SwipeableTabPanel,
    type TabItem,
  } from '@/components/ui/swipeable-tabs'
  import { Badge } from '@/components/ui/badge'
  import TabHomeContent from './tabs/components/TabHomeContent.vue'
  import TabProductContent from './tabs/components/TabProductContent.vue'
  import TabDashboardContent from './tabs/components/TabDashboardContent.vue'

  definePage({
    meta: {
      title: 'Tabs Demo',
    },
  })

  const tabs: TabItem[] = [
    { key: 'home', label: 'Home' },
    { key: 'product', label: 'Product' },
    { key: 'dashboard', label: 'Dashboard' },
  ]

  const activeTab = ref('home')
  const productBadgeCount = ref(5)
</script>

<template>
  <SwipeableTabs v-model="activeTab" :tabs="tabs" full-height class="-mt-4">
    <SwipeableTabBar v-slot="{ tab }">
      {{ tab.label }}
      <Badge v-if="tab.key === 'product'" variant="destructive" class="ml-1">
        {{ productBadgeCount }}
      </Badge>
    </SwipeableTabBar>

    <SwipeableTabPanels>
      <SwipeableTabPanel value="home" class="p-4">
        <TabHomeContent />
      </SwipeableTabPanel>

      <SwipeableTabPanel value="product" class="p-4">
        <TabProductContent />
      </SwipeableTabPanel>

      <SwipeableTabPanel value="dashboard" class="p-4">
        <TabDashboardContent />
      </SwipeableTabPanel>
    </SwipeableTabPanels>
  </SwipeableTabs>
</template>
