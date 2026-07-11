<script lang="ts" setup>
  import { computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import RightSheet from '../RightSheet.vue'

  interface Props {
    open?: boolean
    dismissible?: boolean
    /** Sheet title, e.g. "Add product" / "Edit product" */
    title?: string
    description?: string
    width?: 'sm' | 'md' | 'lg' | 'xl'
    /** Submit button label */
    submitLabel?: string
    /** Cancel button label */
    cancelLabel?: string
    /** Show/hide the built-in cancel button */
    showCancel?: boolean
    /** Loading state for submit button */
    loading?: boolean
    /** Disable submit button */
    disabled?: boolean
    /** Variant for the submit button */
    submitVariant?: 'primary' | 'secondary' | 'tertiary'
  }

  const props = withDefaults(defineProps<Props>(), {
    open: false,
    dismissible: true,
    width: 'md',
    submitLabel: 'Save',
    cancelLabel: 'Cancel',
    showCancel: true,
    loading: false,
    disabled: false,
    submitVariant: 'primary',
  })

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: []
    cancel: []
  }>()

  const isOpen = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const handleCancel = () => {
    emit('cancel')
    isOpen.value = false
  }

  const handleSubmit = (event: Event) => {
    event.preventDefault()
    emit('submit')
  }
</script>

<template>
  <RightSheet
    v-model:open="isOpen"
    :dismissible="dismissible && !loading"
    :title="title"
    :description="description"
    :width="width"
    header-variant="tinted"
    has-footer
    content-slot-class="!p-0"
  >
    <template v-if="$slots.trigger" #trigger>
      <slot name="trigger" />
    </template>

    <form class="flex flex-col" @submit="handleSubmit">
      <slot />
      <!-- Hidden submit to enable Enter-to-submit -->
      <button type="submit" class="hidden" tabindex="-1" aria-hidden="true" />
    </form>

    <template #footer>
      <slot name="footer-extra" />
      <Button
        v-if="showCancel"
        type="button"
        variant="secondary"
        size="md"
        :disabled="loading"
        @click="handleCancel"
      >
        {{ cancelLabel }}
      </Button>
      <Button
        type="button"
        :variant="submitVariant"
        size="md"
        :disabled="disabled || loading"
        @click="handleSubmit"
      >
        <span v-if="loading">Saving…</span>
        <span v-else>{{ submitLabel }}</span>
      </Button>
    </template>
  </RightSheet>
</template>
