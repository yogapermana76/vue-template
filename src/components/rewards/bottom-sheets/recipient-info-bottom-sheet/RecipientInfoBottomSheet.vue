<script setup lang="ts">
  import { watch, type HTMLAttributes } from 'vue'
  import { useForm, Field } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { Button } from '@/components/ui/button'
  import { TextField } from '@/components/ui/form'
  import { cn } from '@/utils/cn'

  export interface RecipientInfoBottomSheetProps {
    /** Whether the bottom sheet is open */
    open?: boolean
    /** Recipient email */
    email?: string
    /** Recipient phone number */
    phone?: string
    /** Bottom sheet title */
    title?: string
    /** Allow dismissing by backdrop click or escape key */
    dismissible?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RecipientInfoBottomSheetProps>(), {
    open: false,
    email: '',
    phone: '',
    title: 'Edit Informasi Penerima',
    dismissible: true,
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    save: [email: string, phone: string]
  }>()

  // ============================================
  // Form Schema & Validation
  // ============================================

  /**
   * Zod validation schema for recipient info
   * Email: Required and must be valid email format
   * noHp: Required and must be numeric
   */
  const recipientInfoSchema = z.object({
    email: z.string().min(1, 'Email diperlukan').email('Format email tidak valid'),
    noHp: z.string().min(1, 'Nomor HP diperlukan').regex(/^\d+$/, 'Nomor HP harus berupa angka'),
  })

  type RecipientInfoFormValues = z.infer<typeof recipientInfoSchema>

  // ============================================
  // Form Initialization
  // ============================================

  const { handleSubmit, resetForm, meta, isSubmitting } = useForm<RecipientInfoFormValues>({
    validationSchema: toTypedSchema(recipientInfoSchema),
    initialValues: {
      email: props.email || '',
      noHp: props.phone || '',
    },
    validateOnMount: false,
  })

  // ============================================
  // Sync Props to Form
  // ============================================

  /**
   * Watch open state and reset form when bottomsheet opens
   * This ensures form is always populated with latest props when user opens the sheet
   */
  watch(
    () => props.open,
    isOpen => {
      if (isOpen) {
        resetForm({
          values: {
            email: props.email || '',
            noHp: props.phone || '',
          },
        })
      }
    },
  )

  // ============================================
  // Form Handlers
  // ============================================

  const onSubmit = handleSubmit(values => {
    emit('save', values.email, values.noHp)
    emit('update:open', false)
  })

  const handleCancel = () => {
    // Reset form to original prop values
    resetForm({
      values: {
        email: props.email || '',
        noHp: props.phone || '',
      },
    })
    emit('update:open', false)
  }
</script>

<template>
  <BottomSheet
    :open="open"
    :dismissible="dismissible"
    :show-close="false"
    has-footer
    footer-position="sticky"
    :class="cn('', props.class)"
    @update:open="emit('update:open', $event)"
  >
    <!-- Content: Title and Form Fields -->
    <div class="flex flex-col gap-4">
      <!-- Title -->
      <h2 class="heading-s text-slate-950">{{ title }}</h2>

      <!-- Form Fields -->
      <div class="flex flex-col gap-4">
        <!-- Email Field -->
        <Field name="email" v-slot="{ field, meta: fieldMeta, errorMessage }">
          <TextField
            :model-value="field.value"
            label="Email"
            placeholder="nama@email.com"
            type="email"
            required
            :error="
              (fieldMeta.touched || fieldMeta.dirty) && !!errorMessage ? errorMessage : undefined
            "
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </Field>

        <!-- Phone Field -->
        <Field name="noHp" v-slot="{ field, meta: fieldMeta, errorMessage }">
          <TextField
            :model-value="field.value"
            label="Nomor Handphone"
            placeholder="08123456789"
            type="tel"
            required
            :error="
              (fieldMeta.touched || fieldMeta.dirty) && !!errorMessage ? errorMessage : undefined
            "
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          />
        </Field>
      </div>
    </div>

    <!-- Footer: Buttons -->
    <template #footer>
      <div class="flex w-full gap-2">
        <Button variant="secondary" size="md" class="flex-1" @click="handleCancel">
          Kembali
        </Button>
        <Button
          variant="primary"
          size="md"
          class="flex-1"
          :disabled="(!meta.valid && meta.dirty) || isSubmitting"
          @click="onSubmit"
        >
          Simpan
        </Button>
      </div>
    </template>
  </BottomSheet>
</template>
