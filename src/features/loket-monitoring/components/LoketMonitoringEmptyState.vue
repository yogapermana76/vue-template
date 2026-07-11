<script setup lang="ts">
  import { EmptyState } from '@/components/ui/empty-state'
  import RiwayatIllustration from '@/assets/illustrations/history.png'

  defineProps<{ hasFilter: boolean }>()
</script>

<template>
  <EmptyState
    :image="RiwayatIllustration"
    image-size="md"
    :title="hasFilter ? 'Data tidak ditemukan' : 'Belum ada data monitoring'"
    :description="
      hasFilter
        ? 'Coba ubah atau reset filter untuk menampilkan tiket lainnya.'
        : 'Data tiket akan muncul di sini setelah ada aktivitas penjualan.'
    "
    class="min-h-60 py-4"
  />
</template>
