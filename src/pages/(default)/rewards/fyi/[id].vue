<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { Header, HeroBanner } from '@/components/layout'
  import { useFYI } from '@/composables/services'
  import type { FYIItem } from '@/types'

  definePage({
    meta: {
      title: 'Detail',
    },
  })

  const route = useRoute()

  const { data: fyiData } = useFYI()

  const fyiItems = computed(() => (fyiData.value?.data ?? []) as FYIItem[])

  const itemOrder = computed(() => {
    const params = route.params as { id?: string }
    return parseInt(params.id || '1') || 1
  })

  const selectedItem = computed(() => {
    return fyiItems.value.find(item => item.order === itemOrder.value) || fyiItems.value[0]
  })
</script>

<template>
  <Header title="Detail" positioning="sticky" />

  <HeroBanner v-if="selectedItem" :src="selectedItem.bannerImageUrl" />

  <main v-if="selectedItem" class="flex flex-1 flex-col gap-6 px-4 pb-24">
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="heading-s text-slate-950">{{ selectedItem.question }}</h1>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="body-caption text-slate-600" v-html="selectedItem.answer" />
      </div>
    </section>
  </main>

  <main v-else class="flex flex-1 flex-col items-center justify-center px-4 pb-24">
    <p class="body-m text-slate-500">Data tidak ditemukan.</p>
  </main>
</template>
