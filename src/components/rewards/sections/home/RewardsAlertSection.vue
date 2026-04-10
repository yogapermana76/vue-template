<script setup lang="ts">
  import { AlertBox } from '@/components/ui/alert'
  import { Button } from '@/components/ui/button'

  const handleVerifyClick = () => {
    // TODO: Navigate to verification page
    console.log('Verify account')
  }
</script>

<template>
  <div class="px-4">
    <AlertBox
      variant="info"
      title="Verifikasi Akun"
      description="Pastikan email dan nomor handphone anda sudah terverifikasi agar bisa menukarkan poin"
    >
      <Button
        variant="tertiary"
        size="sm"
        class="mt-2 h-auto w-auto p-0 text-xs font-semibold"
        @click="handleVerifyClick"
      >
        Verifikasi Sekarang
      </Button>
    </AlertBox>
  </div>
</template>
