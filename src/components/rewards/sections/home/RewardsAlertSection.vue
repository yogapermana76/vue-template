<script setup lang="ts">
  import { computed } from 'vue'
  import { AlertBox, AlertBoxSkeleton } from '@/components/ui/alert'
  import { Button } from '@/components/ui/button'
  import { useVerifyInfo } from '@/composables/services'
  import { openDeeplink } from '@/utils/native-bridge'
  import type { BusinessError, VerifyInfoResponse } from '@/types'

  // Fetch verify info
  const { data: verifyInfo, error, isPending } = useVerifyInfo()

  // Get actual response data (from success response or error response)
  const responseData = computed<VerifyInfoResponse | null>(() => {
    // If data exists, use it (success: true case)
    if (verifyInfo.value) return verifyInfo.value

    // If error with business error flag, extract from error.response.data
    const businessError = error.value as BusinessError<VerifyInfoResponse> | null
    if (businessError?.isBusinessError) {
      return businessError.response?.data ?? null
    }

    return null
  })

  // Check if profile is incomplete (show alert only when success: false and code: "2001")
  const shouldShowAlert = computed(() => {
    return responseData.value?.success === false && responseData.value?.code === '2001'
  })

  // Get deeplink from response data
  const verifyDeeplink = computed(() => {
    return responseData.value?.data?.deeplink
  })

  const handleVerifyClick = () => {
    const deeplink = verifyDeeplink.value
    if (!deeplink) return

    openDeeplink(deeplink)
  }
</script>

<template>
  <!-- Loading State -->
  <div v-if="isPending" class="px-4">
    <AlertBoxSkeleton variant="info" />
  </div>

  <!-- Show alert only when profile is incomplete -->
  <div v-else-if="shouldShowAlert" class="px-4">
    <AlertBox variant="info" title="Verifikasi Akun">
      <template #default>
        <p class="leading-xs text-xs font-normal">
          Pastikan email dan nomor handphone anda sudah terverifikasi agar bisa menukarkan poin
        </p>
        <Button
          variant="tertiary"
          size="sm"
          class="mt-2 h-auto w-auto p-0 text-xs font-semibold"
          @click="handleVerifyClick"
        >
          Verifikasi Sekarang
        </Button>
      </template>
    </AlertBox>
  </div>

  <!-- No alert shown when profile is complete (success: true) -->
</template>
