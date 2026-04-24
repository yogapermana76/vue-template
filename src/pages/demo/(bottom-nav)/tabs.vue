<script setup lang="ts">
  import { ref } from 'vue'
  import {
    SwipeableTabs,
    SwipeableTabBar,
    SwipeableTabPanels,
    BottomNavTabPanel,
    type TabItem,
  } from '@/components/ui/swipeable-tabs'
  import { Badge } from '@/components/ui/badge'
  import TabHomeContent from '@/components/demo/tabs/TabHomeContent.vue'
  import TabProductContent from '@/components/demo/tabs/TabProductContent.vue'
  import TabDashboardContent from '@/components/demo/tabs/TabDashboardContent.vue'

  definePage({
    meta: {
      title: 'Tabs',
      header: {
        subtitle: 'Browse our different tab sections',
      },
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
  <SwipeableTabs v-model="activeTab" :tabs="tabs">
    <SwipeableTabBar v-slot="{ tab }">
      {{ tab.label }}
      <Badge v-if="tab.key === 'product'" variant="destructive" class="ml-1">
        {{ productBadgeCount }}
      </Badge>
    </SwipeableTabBar>

    <SwipeableTabPanels>
      <BottomNavTabPanel value="home">
        <TabHomeContent />
      </BottomNavTabPanel>

      <BottomNavTabPanel value="product">
        <TabProductContent />
      </BottomNavTabPanel>

      <BottomNavTabPanel value="dashboard">
        <TabDashboardContent />
      </BottomNavTabPanel>
    </SwipeableTabPanels>
  </SwipeableTabs>
</template>
