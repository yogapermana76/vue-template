<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { HelpCircle, Headphones, Info } from 'lucide-vue-next'
  import { ActionItem } from '@/components/ui'
  import type { Component } from 'vue'

  const router = useRouter()

  interface FaqItem {
    id: string
    icon: Component
    title: string
    subtitle: string
    action?: () => void
  }

  const faqItems: FaqItem[] = [
    {
      id: 'faq',
      icon: HelpCircle,
      title: 'FAQ',
      subtitle: 'Pertanyaan untuk Green Future Powered Today',
      action: () => router.push('/eco-journey-points/faq'),
    },
    {
      id: 'contact',
      icon: Headphones,
      title: 'Hubungi Kami',
      subtitle: 'Terhubung dengan Green Future Powered Today',
      action: () => router.push('/eco-journey-points/contact'),
    },
    {
      id: 'terms',
      icon: Info,
      title: 'Syarat & Ketentuan',
      subtitle: 'Ketentuan Green Future Powered Today',
      action: () => router.push('/eco-journey-points/terms-and-conditions'),
    },
  ]

  const handleItemClick = (item: FaqItem) => {
    if (item.action) {
      item.action()
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4 pb-4">
    <!-- Header -->
    <div class="px-4">
      <h2 class="body-l-semibold text-slate-950">Lainnya</h2>
    </div>

    <!-- FAQ Items -->
    <div class="flex flex-col">
      <ActionItem
        v-for="item in faqItems"
        :key="item.id"
        :icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
        @click="handleItemClick(item)"
      />
    </div>
  </div>
</template>
