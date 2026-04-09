<script setup lang="ts">
  import { ref } from 'vue'
  import { PillTab } from '@/components/ui/pill-tab'
  import { RewardCouponCard } from '@/components/rewards'

  // Item data
  interface ItemData {
    id: string
    title: string
    imageUrl: string
    points: number
    category: string
  }

  const itemsData = ref<ItemData[]>([
    {
      id: 'b1',
      title: 'Powerbank 20.000mAh',
      imageUrl: 'https://picsum.photos/343/171?random=7',
      points: 15000,
      category: 'electronics',
    },
    {
      id: 'b2',
      title: 'Kaos Premium Limited',
      imageUrl: 'https://picsum.photos/343/171?random=8',
      points: 5000,
      category: 'fashion',
    },
    {
      id: 'b3',
      title: 'Tas Ransel Branded',
      imageUrl: 'https://picsum.photos/343/171?random=9',
      points: 12000,
      category: 'fashion',
    },
    {
      id: 'b4',
      title: 'Headphone Wireless',
      imageUrl: 'https://picsum.photos/343/171?random=10',
      points: 20000,
      category: 'electronics',
    },
  ])

  // Item filter options
  const itemFilters = [
    { key: 'all', label: 'All' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'other', label: 'Other' },
  ]

  const activeItemFilter = ref('all')

  // Filter utility function
  const filteredItems = () => {
    if (activeItemFilter.value === 'all') return itemsData.value
    return itemsData.value.filter(b => b.category === activeItemFilter.value)
  }

  // Event handler
  const handleItemClick = (id: string) => {
    console.log('Claim item:', id)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Filter Pills -->
    <div class="flex gap-2 overflow-x-auto px-4 pt-4">
      <PillTab
        v-for="filter in itemFilters"
        :key="filter.key"
        :state="activeItemFilter === filter.key ? 'filter-active' : 'default'"
        @click="activeItemFilter = filter.key"
      >
        {{ filter.label }}
      </PillTab>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-4 px-4 pb-4">
      <div v-for="item in filteredItems()" :key="item.id" class="w-full">
        <RewardCouponCard
          :title="item.title"
          :image-url="item.imageUrl"
          :points="item.points"
          button-label="Claim Item"
          :on-button-click="() => handleItemClick(item.id)"
        />
      </div>

      <div v-if="filteredItems().length === 0" class="flex items-center justify-center py-8">
        <p class="body-m text-slate-600">No items available</p>
      </div>
    </div>
  </div>
</template>
