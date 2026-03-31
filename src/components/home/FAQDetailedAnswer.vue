<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

  // Optional item data from parent
  interface Props {
    item?: {
      id: string
      title: string
    }
  }

  defineProps<Props>()
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm leading-relaxed">Anda dapat memulai dengan 3 langkah mudah:</p>

    <ol class="list-inside list-decimal space-y-2 text-sm">
      <li class="text-sm">
        <strong>Daftar akun baru</strong> - Klik tombol "Daftar" dan isi form dengan email Anda
      </li>
      <li class="text-sm">
        <strong>Verifikasi email</strong> - Cek email Anda untuk link verifikasi
      </li>
      <li class="text-sm">
        <strong>Setup profil</strong> - Lengkapi profil Anda dan mulai jelajahi fitur
      </li>
    </ol>

    <div class="mt-4 flex gap-2">
      <Button variant="default"> Daftar Sekarang </Button>
      <Button variant="outline"> Lihat Tutorial </Button>
    </div>

    <Alert variant="default" class="mt-4 border-blue-200 bg-blue-50">
      <AlertTitle class="text-blue-900">💡 Tips:</AlertTitle>
      <AlertDescription class="text-blue-700">
        Proses registrasi hanya membutuhkan waktu kurang dari 2 menit. Kami akan memandu Anda di
        setiap langkah!
      </AlertDescription>
    </Alert>
  </div>
</template>
