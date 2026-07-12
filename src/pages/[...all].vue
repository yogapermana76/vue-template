<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { ArrowLeft, Home } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { useAuthStore } from '@/stores'
  import DisappointedMascot from '@/assets/illustrations/disappointed-mascot.png'

  definePage({
    meta: {
      title: '404 - Halaman tidak ditemukan',
    },
  })

  const router = useRouter()
  const auth = useAuthStore()

  const homePath = computed(() => (auth.isAuthenticated ? '/dashboard' : '/login'))
  const homeLabel = computed(() => (auth.isAuthenticated ? 'Ke Dashboard' : 'Ke Login'))

  const goHome = () => router.push(homePath.value)

  const goBack = () => {
    // Fallback to home if there's no history to go back to (e.g. direct URL entry)
    if (window.history.length > 1) {
      router.back()
    } else {
      router.replace(homePath.value)
    }
  }
</script>

<template>
  <div
    class="from-primary-50/40 relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br to-neutral-50 px-4 py-10"
  >
    <!-- `clamp` scales fluidly mobile→desktop, no media queries. -->
    <span
      aria-hidden="true"
      class="text-primary-100/70 pointer-events-none absolute inset-0 flex items-center justify-center leading-none font-black tracking-tighter select-none"
      style="font-size: clamp(14rem, 40vw, 26rem)"
    >
      404
    </span>

    <div class="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
      <img
        :src="DisappointedMascot"
        alt="Maskot kecewa"
        class="h-40 w-auto drop-shadow-sm sm:h-48"
        draggable="false"
      />

      <div class="flex flex-col gap-2">
        <h1 class="text-2xl leading-tight font-bold text-neutral-950 sm:text-3xl">
          Halaman tidak ditemukan
        </h1>
        <p class="body-m mx-auto max-w-md text-neutral-600">
          Halaman yang Anda cari tidak tersedia — mungkin sudah dipindahkan, dihapus, atau URL yang
          diketikkan tidak sesuai.
        </p>
      </div>

      <!-- @click + router.push — RouterLink as-child was collapsing flex layout. -->
      <div class="flex w-full flex-col-reverse items-stretch gap-2.5 sm:w-auto sm:flex-row">
        <Button variant="secondary" size="md" @click="goBack">
          <ArrowLeft class="size-4" />
          <span class="whitespace-nowrap">Kembali</span>
        </Button>
        <Button variant="primary" size="md" @click="goHome">
          <Home class="size-4" />
          <span class="whitespace-nowrap">{{ homeLabel }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>
