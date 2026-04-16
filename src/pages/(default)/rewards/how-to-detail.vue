<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { Header, HeroBanner } from '@/components/layout'
  import FyiImg1 from '@/assets/images/fyi-img-1.png'
  import FyiImg2 from '@/assets/images/fyi-img-2.png'
  import FyiImg3 from '@/assets/images/fyi-img-3.png'

  definePage({
    meta: {
      title: 'Detail',
    },
  })

  const route = useRoute()

  // Hardcoded data for how-to items
  const items = [
    {
      id: 1,
      title: 'Bagaimana mendapatkan poin?',
      image: FyiImg1,
      description:
        'Dapatkan poin dengan mudah melalui berbagai aktivitas seperti check-in, pembelian, dan referral teman. Setiap aktivitas memberikan poin yang dapat dikumpulkan. Semakin banyak aktivitas yang kamu lakukan, semakin banyak poin yang kamu dapatkan. Poin dapat ditukar dengan hadiah menarik di aplikasi ini.',
    },
    {
      id: 2,
      title: 'Bagaimana mengikuti Undian Berhadiah?',
      image: FyiImg2,
      description:
        'Untuk mengikuti undian berhadiah, kamu harus memiliki poin yang cukup. Setiap periode undian memiliki syarat dan ketentuan berbeda. Kamu dapat melihat daftar undian yang tersedia di halaman rewards. Semakin banyak poin yang kamu miliki, semakin besar kesempatan kamu untuk menang. Pemenang akan diumumkan di akhir periode undian.',
    },
    {
      id: 3,
      title: 'Periode penukaran kupon',
      image: FyiImg3,
      description:
        'Kupon dapat ditukar dengan poin yang kamu miliki. Setiap kupon memiliki periode penukaran yang berbeda. Pastikan kamu menukar kupon sebelum periode penukaran berakhir. Kupon yang sudah ditukar akan langsung dapat digunakan. Cek halaman rewards untuk melihat daftar kupon yang tersedia dan periode penukaran masing-masing.',
    },
  ]

  // Get item id from route query
  const itemId = computed(() => parseInt(route.query.id as string) || 1)

  // Find the selected item
  const selectedItem = computed(() => {
    return items.find(item => item.id === itemId.value) || items[0]
  })
</script>

<template>
  <!-- Header -->
  <Header title="Detail" positioning="sticky" />

  <!-- Hero Banner Section -->
  <HeroBanner :src="selectedItem.image" />

  <!-- Content -->
  <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
    <!-- Title & Description Section -->
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="heading-s text-slate-950">{{ selectedItem.title }}</h1>
        <p class="body-caption text-slate-600">
          {{ selectedItem.description }}
        </p>
      </div>
    </section>
  </main>
</template>
