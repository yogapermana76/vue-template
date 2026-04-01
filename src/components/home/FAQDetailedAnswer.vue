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
      <Button class="bg-primary-500 hover:bg-primary-600 text-white"> Daftar Sekarang </Button>
      <Button
        variant="outline"
        class="border-secondary-300 text-secondary-600 hover:bg-secondary-50"
      >
        Lihat Tutorial
      </Button>
    </div>

    <Alert variant="default" class="border-primary-200 bg-primary-50 mt-4">
      <AlertTitle class="text-primary-800">💡 Tips:</AlertTitle>
      <AlertDescription class="text-primary-700">
        Proses registrasi hanya membutuhkan waktu kurang dari 2 menit. Kami akan memandu Anda di
        setiap langkah!
      </AlertDescription>
    </Alert>
  </div>
</template>
