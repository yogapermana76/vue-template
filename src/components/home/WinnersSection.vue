<script setup lang="ts">
  import { WinnerCard } from '@/components/rewards'

  const winners = [
    {
      rank: 1,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Subeni',
        email: 'lisxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
    },
    {
      rank: 2,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Busra',
        email: 'busxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
    },
    {
      rank: 3,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Elthon J Huwae',
        email: 'eltxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
    },
    {
      rank: 4,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Lisa Apryani',
        email: 'lisxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
    },
    {
      rank: 5,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Faidil Bujang',
        email: 'fasxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
    },
    {
      rank: 6,
      prize: 'Mobil Listrik',
      winner: {
        name: 'Elthon J Huwae',
        email: 'eltxxxxx@gmail.com',
        phone: '628533333xxxx',
      },
    },
  ]
</script>

<template>
  <section class="px-4 py-6">
    <h2 class="heading-s mb-4 text-slate-900">Pemenang Undian</h2>
    <div class="flex flex-col gap-2">
      <WinnerCard
        v-for="w in winners"
        :key="w.rank"
        :rank="w.rank"
        :prize="w.prize"
        :winner="w.winner"
      />
    </div>
  </section>
</template>
