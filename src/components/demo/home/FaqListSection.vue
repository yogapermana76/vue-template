<script setup lang="ts">
  import { ExpandableItem } from '@/components/ui'

  const faqItems = [
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
</script>

<template>
  <section class="flex flex-col gap-4 p-4">
    <h2 class="body-l-semibold text-slate-950">FAQ</h2>
    <div class="flex flex-col gap-2">
      <ExpandableItem
        v-for="item in faqItems"
        :key="item.id"
        :question="item.question"
        :answer="item.answer"
        :value="`faq-${item.id}`"
      />
    </div>
  </section>
</template>
