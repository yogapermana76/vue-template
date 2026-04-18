<script setup lang="ts">
  import { computed } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination } from 'swiper/modules'
  import { WinnerInfoCard } from '@/components/rewards'
  import { SwiperPagination } from '@/components/ui/swiper'

  interface WinnerItem {
    id: string | number
    title: string
    description: string
  }

  interface WinnerInfoSwiperProps {
    /** Winner items to display */
    items: WinnerItem[]
    /** Loading state */
    isLoading?: boolean
  }

  const props = withDefaults(defineProps<WinnerInfoSwiperProps>(), {
    isLoading: false,
  })

  const emit = defineEmits<{
    click: [itemId: string | number]
  }>()

  // Check if we need swiper (more than 1 item)
  const needsSwiper = computed(() => props.items.length > 1)

  const modules = [Pagination]

  const handleClick = (itemId: string | number) => {
    emit('click', itemId)
  }
</script>

<template>
  <!-- Loading Skeleton -->
  <div v-if="isLoading" class="px-4">
    <div class="h-16 w-full animate-pulse rounded-sm bg-white/10"></div>
  </div>

  <!-- No Items -->
  <div v-else-if="items.length === 0" class="px-4">
    <div class="rounded-sm bg-white/5 p-4 text-center">
      <p class="body-caption text-white/60">Belum ada informasi pemenang</p>
    </div>
  </div>

  <!-- Multiple Items - Swiper -->
  <div v-else-if="needsSwiper" class="flex flex-col gap-2">
    <div>
      <swiper
        :modules="modules"
        :slides-per-view="1.02"
        :space-between="12"
        :slides-offset-before="16"
        :slides-offset-after="16"
        :pagination="{ clickable: true, el: '#swiper-pagination-winners' }"
      >
        <swiper-slide v-for="item in items" :key="item.id">
          <WinnerInfoCard
            :title="item.title"
            :description="item.description"
            @click="handleClick(item.id)"
          />
        </swiper-slide>
      </swiper>
    </div>

    <!-- Reusable Swiper Pagination -->
    <SwiperPagination id="swiper-pagination-winners" variant="small" class="px-4" />
  </div>

  <!-- Single Item - No Swiper -->
  <div v-else class="px-4">
    <WinnerInfoCard
      :title="items[0].title"
      :description="items[0].description"
      @click="handleClick(items[0].id)"
    />
  </div>
</template>
