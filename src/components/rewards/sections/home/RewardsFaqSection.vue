<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import { ExpandableItem, ExpandableItemSkeleton } from '@/components/ui/accordion'
  import { EmptyState } from '@/components/ui/empty-state'
  import { useFAQ } from '@/composables/services'
  import RiwayatIllustration from '@/assets/illustrations/history.png'

  export interface Props {
    title?: string
    showViewAll?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Frequently Asked Questions (FAQ)',
    showViewAll: true,
  })

  const showAll = ref(false)
  const INITIAL_LIMIT = 5

  // Fetch FAQ data
  const { data: faqData, isPending, isError } = useFAQ()

  // Transform and limit FAQ data
  const faqItems = computed(() => {
    if (!faqData.value?.data || !Array.isArray(faqData.value.data)) return []

    const allItems = faqData.value.data.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    }))

    // Show limited or all items based on state
    return showAll.value ? allItems : allItems.slice(0, INITIAL_LIMIT)
  })

  const hasMoreItems = computed(() => {
    if (!faqData.value?.data || !Array.isArray(faqData.value.data)) return false
    return faqData.value.data.length > INITIAL_LIMIT
  })

  const handleViewAllClick = () => {
    showAll.value = !showAll.value
  }

  const buttonLabel = computed(() => {
    return showAll.value ? 'Lihat Lebih Sedikit' : 'Lihat Semua'
  })
</script>

<template>
  <section class="flex flex-col items-center gap-3 px-4 py-6">
    <!-- Title Section -->
    <div class="flex w-full items-center justify-between gap-2">
      <h2 class="body-l-semibold flex-1 text-slate-950">{{ props.title }}</h2>
    </div>

    <!-- Loading State -->
    <template v-if="isPending">
      <div class="flex w-full flex-col gap-2">
        <ExpandableItemSkeleton v-for="i in INITIAL_LIMIT" :key="i" />
      </div>
    </template>

    <!-- Error State -->
    <div v-else-if="isError" class="flex w-full flex-col items-center justify-center py-8">
      <EmptyState
        :image="RiwayatIllustration"
        title="Gagal memuat FAQ"
        description="Terjadi kesalahan saat memuat FAQ. Silakan coba lagi."
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="faqItems.length === 0"
      class="flex w-full flex-col items-center justify-center py-8"
    >
      <EmptyState
        :image="RiwayatIllustration"
        title="Belum ada FAQ"
        description="FAQ belum tersedia saat ini."
      />
    </div>

    <!-- Data State -->
    <template v-else>
      <!-- FAQ Items -->
      <div class="flex w-full flex-col gap-2">
        <ExpandableItem
          v-for="item in faqItems"
          :key="item.id"
          :question="item.question"
          :answer="item.answer"
          :value="`faq-${item.id}`"
        />
      </div>

      <!-- View All Button -->
      <Button
        v-if="props.showViewAll && hasMoreItems"
        variant="secondary"
        size="sm"
        class="w-full"
        @click="handleViewAllClick"
      >
        {{ buttonLabel }}
      </Button>
    </template>
  </section>
</template>
