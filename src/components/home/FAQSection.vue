<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import { Mail } from 'lucide-vue-next'
  import { AccordionList } from '@/components/ui/accordion'
  import { Button } from '@/components/ui/button'
  import FAQDetailedAnswer from './FAQDetailedAnswer.vue'

  interface FAQItem {
    id: string
    question: string
    answer: string | Component // text, HTML, or component
    advanced?: boolean
  }

  interface Props {
    items?: FAQItem[]
    title?: string
    description?: string
    supportEmail?: string
    showCTA?: boolean
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Pertanyaan yang Sering Diajukan',
    description: 'Temukan jawaban untuk pertanyaan umum tentang aplikasi kami dan cara kerjanya.',
    supportEmail: 'support@example.com',
    showCTA: true,
  })

  // Default FAQ items
  const DEFAULT_FAQS: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'Bagaimana cara memulai dengan aplikasi ini?',
      answer: FAQDetailedAnswer,
      advanced: true,
    },
    {
      id: 'faq-2',
      question: 'Apakah aplikasi ini gratis digunakan?',
      answer:
        'Ya, aplikasi ini <strong>sepenuhnya gratis</strong> untuk digunakan. Kami menyediakan semua fitur dasar tanpa biaya tambahan. Tidak ada biaya tersembunyi atau upgrade paksa.',
    },
    {
      id: 'faq-3',
      question: 'Bagaimana jika saya mengalami masalah teknis?',
      answer:
        'Tim dukungan kami siap membantu Anda <strong>24/7</strong>. Hubungi kami melalui email support atau chat untuk penyelesaian cepat. Rata-rata response time kami adalah kurang dari 1 jam.',
    },
    {
      id: 'faq-4',
      question: 'Apakah data saya aman?',
      answer:
        'Keamanan data Anda adalah prioritas utama kami. Kami menggunakan <em>enkripsi tingkat enterprise</em> dan standar keamanan industri terbaru termasuk SSL/TLS, two-factor authentication, dan regular security audits.',
    },
    {
      id: 'faq-5',
      question: 'Bisakah saya mengakses aplikasi dari perangkat berbeda?',
      answer:
        'Tentu saja! Akun Anda dapat diakses dari perangkat apa pun. Cukup masuk dengan kredensial yang sama dan lanjutkan di mana pun Anda berada. Data Anda akan tersinkronisasi otomatis.',
    },
  ]

  const faqs = props.items || DEFAULT_FAQS
  const { title, description, supportEmail, showCTA, class: className } = props

  const accordionItems = faqs.map(faq => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
  }))
</script>

<template>
  <section :class="['bg-muted w-full py-12', className]">
    <div class="container px-4">
      <!-- Section header -->
      <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="mb-3 text-2xl font-bold tracking-tight">
          {{ title }}
        </h2>
        <p class="text-muted-foreground">
          {{ description }}
        </p>
      </div>

      <div class="mx-auto max-w-2xl">
        <AccordionList :items="accordionItems" />
      </div>

      <!-- Support CTA -->
      <div v-if="showCTA" class="mt-12 text-center">
        <p class="text-muted-foreground mb-4">Tidak menemukan jawaban yang Anda cari?</p>
        <Button as-child>
          <a :href="`mailto:${supportEmail}`" class="flex items-center gap-2">
            <Mail class="h-4 w-4" />
            Hubungi Dukungan
          </a>
        </Button>
      </div>
    </div>
  </section>
</template>
