<script setup lang="ts">
  import { ref, watch, onUnmounted } from 'vue'
  import { X } from 'lucide-vue-next'
  import { Image } from '@/components/ui/image'

  interface Props {
    image?: File | string | null
    showReupload?: boolean
    size?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    image: null,
    showReupload: false,
    size: 109,
  })

  const emit = defineEmits<{
    remove: []
    reupload: [file: File]
  }>()

  const fileInputRef = ref<HTMLInputElement | null>(null)
  const imageUrl = ref<string | null>(null)

  // Watch for image changes and create/cleanup URLs
  watch(
    () => props.image,
    (newImage, oldImage) => {
      // Cleanup old object URL if it exists
      if (imageUrl.value && oldImage instanceof File) {
        URL.revokeObjectURL(imageUrl.value)
        imageUrl.value = null
      }

      // Set new image URL
      if (!newImage) {
        imageUrl.value = null
      } else if (typeof newImage === 'string') {
        // String URL from server - use directly
        imageUrl.value = newImage
      } else if (newImage instanceof File) {
        // File object - create object URL
        imageUrl.value = URL.createObjectURL(newImage)
      }
    },
    { immediate: true },
  )

  // Cleanup on unmount
  onUnmounted(() => {
    if (imageUrl.value && props.image instanceof File) {
      URL.revokeObjectURL(imageUrl.value)
      imageUrl.value = null
    }
  })

  const handleReupload = () => {
    fileInputRef.value?.click()
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      emit('reupload', file)
      // Reset input to allow re-selecting the same file
      target.value = ''
    }
  }
</script>

<template>
  <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- Image Preview using Image component -->
    <Image
      v-if="imageUrl"
      :src="imageUrl"
      alt="Preview"
      aspect-ratio="square"
      object-fit="cover"
      loading-strategy="skeleton"
      :lazy="false"
      container-class="h-full w-full rounded-lg border-2 border-neutral-300"
    />
    <div v-else class="h-full w-full rounded-lg border-2 border-neutral-300 bg-neutral-100" />

    <!-- Delete Button -->
    <button
      type="button"
      class="bg-error-100 border-error-100 hover:bg-error-200 absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors"
      @click="emit('remove')"
    >
      <X class="text-error-500 h-2 w-2" :stroke-width="2" />
    </button>

    <!-- Re-upload Button -->
    <button
      v-if="showReupload"
      type="button"
      class="body-small-medium absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-slate-800/40 px-1.5 py-1 whitespace-nowrap text-white transition-colors hover:bg-slate-800/60"
      @click="handleReupload"
    >
      Upload Ulang
    </button>

    <!-- Hidden file input for re-upload -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>
