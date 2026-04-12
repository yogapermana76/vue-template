<script setup lang="ts">
  import { Header } from '@/components/layout'
  import { ExpandableItem } from '@/components/ui'

  definePage({
    meta: {
      title: 'FAQ',
    },
  })

  interface FaqData {
    id: number
    question: string
    answer: string
  }

  const faqItems: FaqData[] = [
    {
      id: 1,
      question: 'Apa itu Eco Journey Points?',
      answer:
        'Eco Journey Points adalah gamikasi di PLN Mobile dengan sistem poin untuk pengguna aplikasi PLN Mobile yang menaiki transportasi umum listrik di Jabodetabek yang dapat ditukar dengan hadiah di aplikasi PLN Mobile',
    },
    {
      id: 2,
      question: 'Bagaimana cara mengikuti program ini?',
      answer:
        'Anda dapat mengikuti program ini dengan menggunakan transportasi umum listrik di Jabodetabek dan melakukan scan QR Code di stasiun atau halte.',
    },
    {
      id: 3,
      question: 'Di mana saya bisa menemukan transportasi umum listrik yang berpartisipasi?',
      answer:
        'Transportasi umum listrik yang berpartisipasi meliputi MRT Jakarta, LRT Jakarta, dan Trans Jakarta listrik di area Jabodetabek.',
    },
    {
      id: 4,
      question: 'Berapa poin yang saya dapatkan untuk setiap pemindaian QR Code?',
      answer:
        'Anda akan mendapatkan 5 poin untuk setiap pemindaian QR Code yang berhasil di transportasi umum listrik.',
    },
    {
      id: 5,
      question: 'Bagaimana cara menukarkan poin saya ?',
      answer:
        'Poin dapat ditukarkan dengan berbagai voucher dan hadiah menarik melalui menu Eco Journey Points di aplikasi PLN Mobile.',
    },
    {
      id: 6,
      question: 'Apakah poin memiliki masa berlaku ?',
      answer:
        'Ya, poin memiliki masa berlaku selama 12 bulan sejak tanggal perolehan. Pastikan untuk menukarkan poin Anda sebelum kadaluarsa.',
    },
    {
      id: 7,
      question: 'Apakah ada batasan jumlah pemindaian QR Code ?',
      answer:
        'Ya, Anda dapat melakukan maksimal 10 kali pemindaian QR Code per hari untuk mendapatkan poin.',
    },
    {
      id: 8,
      question:
        'Apa yang harus saya lakukan jika terdapat permasalahan dalam check in/scan QR code ?',
      answer:
        'Jika Anda mengalami masalah, silakan hubungi customer service PLN Mobile melalui menu bantuan di aplikasi atau hubungi call center 123.',
    },
  ]
</script>

<template>
  <!-- Header -->
  <Header title="FAQ" positioning="sticky" />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-3 px-4 py-4">
    <!-- Title Section -->
    <h2 class="body-l-semibold text-slate-950">FAQ untuk Eco Journey Points</h2>

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
  </main>
</template>
