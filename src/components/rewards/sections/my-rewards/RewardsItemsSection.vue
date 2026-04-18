<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { RewardCouponCard } from '@/components/rewards'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useUserGiftInstantly } from '@/composables/services'
  import RiwayatIllustration from '@/assets/illustrations/riwayat.svg'

  const router = useRouter()

  // Fetch user gift instantly items
  const { data: giftInstantlyData } = useUserGiftInstantly({
    query: { page: 0, size: 10 },
  })

  // Debug: log data on change
  watch(giftInstantlyData, val => {
    // eslint-disable-next-line no-console
    console.log('User Gift Instantly Data:', val)
  })

  // Item data
  interface ItemData {
    id: string
    title: string
    imageUrl: string
    points: number
  }

  const itemsData = ref<ItemData[]>([
    {
      id: 'b1',
      title: 'Powerbank 20.000mAh',
      imageUrl: 'https://picsum.photos/343/171?random=7',
      points: 15000,
    },
    {
      id: 'b2',
      title: 'Kaos Premium Limited',
      imageUrl: 'https://picsum.photos/343/171?random=8',
      points: 5000,
    },
    {
      id: 'b3',
      title: 'Tas Ransel Branded',
      imageUrl: 'https://picsum.photos/343/171?random=9',
      points: 12000,
    },
    {
      id: 'b4',
      title: 'Headphone Wireless',
      imageUrl: 'https://picsum.photos/343/171?random=10',
      points: 20000,
    },
  ])

  // Event handler
  const handleItemClick = (id: string) => {
    router.push({
      path: `/rewards/my-rewards/${id}`,
      query: { type: 'item' },
    })
  }
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div v-for="item in itemsData" :key="item.id" class="w-full">
      <RewardCouponCard
        :title="item.title"
        :image-url="item.imageUrl"
        :points="item.points"
        button-label="Claim Item"
        :on-button-click="() => handleItemClick(item.id)"
      />
    </div>

    <EmptyState
      v-if="itemsData.length === 0"
      :image="RiwayatIllustration"
      title="Barang belum tersedia"
      description="Mohon maaf barang sedang tidak tersedia untuk saat ini."
    />
  </div>
</template>
