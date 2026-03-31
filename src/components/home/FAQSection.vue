<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion'

  const faqs = [
    {
      id: 'faq-1',
      question: 'Bagaimana cara memulai dengan aplikasi ini?',
      answer:
        'Anda dapat memulai dengan mendaftar akun baru atau masuk dengan akun yang sudah ada. Setelah itu, jelajahi fitur-fitur yang tersedia di dashboard atau halaman produk.',
    },
    {
      id: 'faq-2',
      question: 'Apakah aplikasi ini gratis digunakan?',
      answer:
        'Ya, aplikasi ini sepenuhnya gratis untuk digunakan. Kami menyediakan semua fitur dasar tanpa biaya tambahan.',
    },
    {
      id: 'faq-3',
      question: 'Bagaimana jika saya mengalami masalah teknis?',
      answer:
        'Tim dukungan kami siap membantu Anda 24/7. Hubungi kami melalui email support atau chat untuk penyelesaian cepat.',
    },
    {
      id: 'faq-4',
      question: 'Apakah data saya aman?',
      answer:
        'Keamanan data Anda adalah prioritas utama kami. Kami menggunakan enkripsi tingkat enterprise dan standar keamanan industri terbaru.',
    },
    {
      id: 'faq-5',
      question: 'Bisakah saya mengakses aplikasi dari perangkat berbeda?',
      answer:
        'Tentu saja! Akun Anda dapat diakses dari perangkat apa pun. Cukup masuk dengan kredensial yang sama dan lanjutkan di mana pun Anda berada.',
    },
  ]
</script>

<template>
  <section class="bg-muted w-full py-16 md:py-24">
    <div class="container px-4 md:px-6">
      <!-- Section Header -->
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p class="text-muted-foreground">
          Temukan jawaban untuk pertanyaan umum tentang aplikasi kami dan cara kerjanya.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="mx-auto max-w-2xl">
        <Accordion type="single" collapsible class="w-full">
          <AccordionItem v-for="faq in faqs" :key="faq.id" :value="faq.id">
            <AccordionTrigger class="text-left text-base font-semibold hover:no-underline">
              {{ faq.question }}
            </AccordionTrigger>
            <AccordionContent class="text-muted-foreground">
              {{ faq.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <!-- Support CTA -->
      <div class="mt-12 text-center">
        <p class="text-muted-foreground mb-4">Tidak menemukan jawaban yang Anda cari?</p>
        <a
          href="mailto:support@example.com"
          class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium"
        >
          Hubungi Dukungan
        </a>
      </div>
    </div>
  </section>
</template>
