<script setup lang="ts">
  import { ref } from 'vue'
  import { RewardCouponCard } from '@/components/rewards'

  // History item data
  interface HistoryItem {
    id: string
    title: string
    imageUrl: string
    points: number
    expiryDate?: string
  }

  const historyData = ref<HistoryItem[]>([
    {
      id: '1',
      title: 'Marketplace',
      imageUrl: 'https://picsum.photos/343/171?random=11',
      points: 5,
    },
    {
      id: '2',
      title: 'Voucher 100.000',
      imageUrl: 'https://picsum.photos/343/171?random=12',
      points: -50,
    },
  ])

  // Event handlers
  const handleClick = (id: string) => {
    console.log('Item clicked:', id)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="item in historyData" :key="item.id" class="w-full">
      <RewardCouponCard
        :title="item.title"
        :image-url="item.imageUrl"
        :points="item.points"
        button-label="Redeem"
        :on-button-click="() => handleClick(item.id)"
      />
    </div>

    <div v-if="historyData.length === 0" class="flex items-center justify-center py-8">
      <p class="body-m text-slate-600">No history available</p>
    </div>
  </div>
</template>
