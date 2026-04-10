<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import { FaqItem } from '@/components/rewards'

  export interface FaqData {
    id: number
    question: string
    answer: string
  }

  interface Props {
    title?: string
    showViewAll?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Frequently Asked Questions (FAQ)',
    showViewAll: true,
  })

  const faqItems: FaqData[] = [
    {
      id: 1,
      question: 'Apa itu Program Gelegar PLN Mobile 2025?',
      answer:
        'Program Gelegar PLN Mobile 2025 adalah program loyalitas yang memberikan reward kepada pengguna aktif aplikasi PLN Mobile.',
    },
    {
      id: 2,
      question: 'Kapan periode program Gelegar PLN Mobile 2025 berlangsung?',
      answer: 'Program berlangsung mulai Januari hingga Desember 2025.',
    },
    {
      id: 3,
      question: 'Siapa saja yang bisa ikut program Gelegar PLN Mobile 2025?',
      answer: 'Semua pengguna terdaftar PLN Mobile dapat mengikuti program ini.',
    },
    {
      id: 4,
      question: 'Bagaimana cara mendapatkan poin?',
      answer:
        'Anda bisa mendapatkan poin dengan melakukan transaksi pembayaran listrik melalui PLN Mobile.',
    },
    {
      id: 5,
      question: 'Bagaimana cara menukarkan poin?',
      answer:
        'Poin dapat ditukarkan dengan berbagai reward menarik melalui menu rewards di aplikasi.',
    },
  ]

  const handleViewAllClick = () => {
    // TODO: Navigate to FAQ page or expand all items
  }
</script>

<template>
  <section class="flex flex-col items-center gap-3 px-4 py-6">
    <!-- Title Section -->
    <div class="flex w-full items-center justify-between gap-2">
      <h2 class="body-l-semibold flex-1 text-slate-950">{{ props.title }}</h2>
    </div>

    <!-- FAQ Items -->
    <div class="flex w-full flex-col gap-2">
      <FaqItem
        v-for="item in faqItems"
        :key="item.id"
        :question="item.question"
        :answer="item.answer"
        :value="`faq-${item.id}`"
      />
    </div>

    <!-- View All Button -->
    <Button
      v-if="props.showViewAll"
      variant="secondary"
      size="sm"
      class="w-full"
      @click="handleViewAllClick"
    >
      Lihat Semua
    </Button>
  </section>
</template>
