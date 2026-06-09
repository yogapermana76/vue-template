<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ImagePlus } from 'lucide-vue-next'
  import ImageUploadItem from './ImageUploadItem.vue'

  interface UploadedImage {
    id: string
    file: File | string
  }

  interface Props {
    modelValue?: (File | string)[]
    multiple?: boolean
    maxFiles?: number
    accept?: string
    size?: number
    gap?: number
    disabled?: boolean
    showReupload?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    multiple: false,
    maxFiles: 10,
    accept: 'image/*',
    size: 109,
    gap: 8,
    disabled: false,
    showReupload: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [files: (File | string)[]]
  }>()

  const fileInputRef = ref<HTMLInputElement | null>(null)

  const uploadedImages = computed<UploadedImage[]>(() => {
    return props.modelValue.map((file, index) => ({
      id: `image-${index}`,
      file,
    }))
  })

  const canAddMore = computed(() => {
    return props.multiple && uploadedImages.value.length < props.maxFiles
  })

  const handleFileSelect = () => {
    if (props.disabled) return
    fileInputRef.value?.click()
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])

    if (files.length === 0) return

    if (props.multiple) {
      const remainingSlots = props.maxFiles - uploadedImages.value.length
      const filesToAdd = files.slice(0, remainingSlots)
      emit('update:modelValue', [...props.modelValue, ...filesToAdd])
    } else {
      emit('update:modelValue', [files[0]])
    }

    // Reset input to allow re-selecting same file
    target.value = ''
  }

  const handleRemove = (index: number) => {
    const newFiles = [...props.modelValue]
    newFiles.splice(index, 1)
    emit('update:modelValue', newFiles)
  }

  const handleReupload = (index: number, newFile: File) => {
    const newFiles = [...props.modelValue]
    newFiles[index] = newFile
    emit('update:modelValue', newFiles)
  }
</script>

<template>
  <div class="flex flex-row flex-wrap items-center" :style="{ gap: `${gap}px` }">
    <ImageUploadItem
      v-for="(image, index) in uploadedImages"
      :key="image.id"
      :image="image.file"
      :show-reupload="showReupload"
      :size="size"
      @remove="handleRemove(index)"
      @reupload="file => handleReupload(index, file)"
    />

    <!-- Upload Button -->
    <button
      v-if="uploadedImages.length === 0 || canAddMore"
      type="button"
      class="bg-primary-50 border-primary-500 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-7 transition-colors"
      :class="disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary-100 cursor-pointer'"
      :style="{ width: `${size}px`, height: `${size}px` }"
      :disabled="disabled"
      @click="handleFileSelect"
    >
      <!-- Icon with plus -->
      <div class="relative h-8 w-8">
        <ImagePlus class="text-primary-500 h-full w-full" :stroke-width="1.5" />
      </div>

      <!-- Text -->
      <span class="text-primary-500 body-small-medium whitespace-nowrap">Tambah Image</span>
    </button>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden"
      :disabled="disabled"
      @change="handleFileChange"
    />
  </div>
</template>
