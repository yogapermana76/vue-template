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
  import TabHomeContent from '@/components/tabs/TabHomeContent.vue'
  import TabProductContent from '@/components/tabs/TabProductContent.vue'
  import TabDashboardContent from '@/components/tabs/TabDashboardContent.vue'

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
  <div class="flex flex-col">
    <SwipeableTabs v-model="activeTab" :tabs="tabs" full-height class="flex-1">
      <SwipeableTabBar v-slot="{ tab }">
        {{ tab.label }}
        <Badge v-if="tab.key === 'product'" variant="destructive" class="ml-1">
          {{ productBadgeCount }}
        </Badge>
      </SwipeableTabBar>

      <SwipeableTabPanels class="bg-white">
        <SwipeableTabPanel value="home">
          <div class="p-4">
            <TabHomeContent />
          </div>
        </SwipeableTabPanel>

        <SwipeableTabPanel value="product">
          <div class="p-4">
            <TabProductContent />
          </div>
        </SwipeableTabPanel>

        <SwipeableTabPanel value="dashboard">
          <div class="p-4">
            <TabDashboardContent />
          </div>
        </SwipeableTabPanel>
      </SwipeableTabPanels>
    </SwipeableTabs>
  </div>
</template>
