<script setup lang="ts">
  import { ref, computed, watch, type HTMLAttributes } from 'vue'
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

  // Local form state
  const localEmail = ref(props.email)
  const localPhone = ref(props.phone)

  // Watch props for external updates
  watch(
    () => props.email,
    newEmail => {
      localEmail.value = newEmail || ''
    },
  )

  watch(
    () => props.phone,
    newPhone => {
      localPhone.value = newPhone || ''
    },
  )

  // Check if form is valid
  const isFormValid = computed(() => {
    return localEmail.value.trim() !== '' && localPhone.value.trim() !== ''
  })

  const handleSave = () => {
    if (isFormValid.value) {
      emit('save', localEmail.value, localPhone.value)
      emit('update:open', false)
    }
  }

  const handleCancel = () => {
    // Reset local state to original values
    localEmail.value = props.email || ''
    localPhone.value = props.phone || ''
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
        <TextField
          v-model="localEmail"
          label="Email"
          placeholder="nama@email.com"
          type="email"
          required
        />

        <!-- Phone Field -->
        <TextField
          v-model="localPhone"
          label="Nomor Handphone"
          placeholder="08123456789"
          type="tel"
          required
        />
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
          :disabled="!isFormValid"
          @click="handleSave"
        >
          Simpan
        </Button>
      </div>
    </template>
  </BottomSheet>
</template>
