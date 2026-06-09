<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import type { AlertVariants } from '@/components/ui/alert'
  import { FormField } from '@/components/ui/form'
  import { AlertBox } from '@/components/ui/alert'
  import ImageUploader from './ImageUploader.vue'

  export interface ImageUploaderFieldProps {
    /** Array of files or URLs (v-model) */
    modelValue?: (File | string)[]
    /** Label text */
    label?: string
    /** Field id (also used for label's for attribute) */
    id?: string
    /** Show required indicator (*) */
    required?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Helper/description text */
    helper?: string
    /** Error message (overrides helper when present) */
    error?: string | string[]
    /** Right-side footer text */
    footerRight?: string
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Enable multiple image upload */
    multiple?: boolean
    /** Maximum number of files allowed */
    maxFiles?: number
    /** Accepted file types */
    accept?: string
    /** Image preview size in pixels */
    size?: number
    /** Gap between images in pixels */
    gap?: number
    /** Show re-upload button on hover */
    showReupload?: boolean
    /** Show alert box above uploader */
    showAlert?: boolean
    /** Alert variant */
    alertVariant?: AlertVariants['variant']
    /** Alert title */
    alertTitle?: string
    /** Alert description */
    alertDescription?: string
    /** Alert icon (lucide component or false to hide) */
    alertIcon?: Component | boolean
  }

  const props = withDefaults(defineProps<ImageUploaderFieldProps>(), {
    modelValue: () => [],
    required: false,
    disabled: false,
    multiple: false,
    maxFiles: 10,
    accept: 'image/*',
    size: 109,
    gap: 8,
    showReupload: false,
    showAlert: false,
    alertVariant: 'info',
    alertIcon: true,
  })

  const emit = defineEmits<{
    'update:modelValue': [files: (File | string)[]]
  }>()

  const handleUpdate = (files: (File | string)[]) => {
    emit('update:modelValue', files)
  }
</script>

<template>
  <FormField
    :label="label"
    :for="id"
    :required="required"
    :helper="helper"
    :error="error"
    :footer-right="footerRight"
    :disabled="disabled"
    :class="props.class"
  >
    <!-- Label Right Slot -->
    <template v-if="$slots.labelRight" #labelRight>
      <slot name="labelRight" />
    </template>

    <!-- Alert Box (optional) -->
    <AlertBox
      v-if="showAlert || $slots.alert"
      :variant="alertVariant"
      :title="alertTitle"
      :description="alertDescription"
      :icon="alertIcon"
      class="mb-2"
    >
      <slot name="alert" />
    </AlertBox>

    <!-- Image Uploader -->
    <ImageUploader
      :model-value="modelValue"
      :multiple="multiple"
      :max-files="maxFiles"
      :accept="accept"
      :size="size"
      :gap="gap"
      :disabled="disabled"
      :show-reupload="showReupload"
      @update:model-value="handleUpdate"
    />

    <!-- Helper Slot -->
    <template v-if="$slots.helper" #helper>
      <slot name="helper" />
    </template>

    <!-- Footer Right Slot -->
    <template v-if="$slots.footerRight" #footerRight>
      <slot name="footerRight" />
    </template>
  </FormField>
</template>
