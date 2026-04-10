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
  <div class="flex h-full flex-col">
    <SwipeableTabs v-model="activeTab" :tabs="tabs" class="flex-1">
      <SwipeableTabBar v-slot="{ tab }">
        {{ tab.label }}
        <Badge v-if="tab.key === 'product'" variant="destructive" class="ml-1">
          {{ productBadgeCount }}
        </Badge>
      </SwipeableTabBar>

      <SwipeableTabPanels>
        <SwipeableTabPanel value="home">
          <TabHomeContent />
        </SwipeableTabPanel>

        <SwipeableTabPanel value="product">
          <TabProductContent />
        </SwipeableTabPanel>

        <SwipeableTabPanel value="dashboard">
          <TabDashboardContent />
        </SwipeableTabPanel>
      </SwipeableTabPanels>
    </SwipeableTabs>
  </div>
</template>
