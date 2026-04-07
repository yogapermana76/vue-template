<script setup lang="ts">
  import { FaqItem } from '@/components/rewards'

  const faqItems = [
    { id: 1, question: 'Apa itu Program Gelegar PLN Mobile 2025?', to: '/faq/about-program' },
    {
      id: 2,
      question: 'Kapan periode program Gelegar PLN Mobile 2025 berlangsung?',
      to: '/faq/period',
    },
    {
      id: 3,
      question: 'Siapa saja yang bisa ikut program Gelegar PLN Mobile 2025?',
      to: '/faq/eligibility',
    },
    { id: 4, question: 'Bagaimana cara mendapatkan poin?', to: '/faq/earn-points' },
    { id: 5, question: 'Bagaimana cara menukarkan poin?', to: '/faq/redeem-points' },
  ]
</script>

<template>
  <section class="flex flex-col gap-4 p-4">
    <h2 class="body-l-semibold text-slate-950">FAQ</h2>
    <div class="flex flex-col gap-2">
      <FaqItem v-for="item in faqItems" :key="item.id" :question="item.question" :to="item.to" />
    </div>
  </section>
</template>
