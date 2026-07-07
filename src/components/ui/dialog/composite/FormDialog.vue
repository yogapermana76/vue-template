<script setup lang="ts">
  /**
   * Form dialog with the same card-in-canvas pattern as `DetailDialog`.
   * Consumers plug in FormSection blocks via the default slot; footer buttons
   * use the same shape as `DetailDialog` for visual consistency.
   */
  import { computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import DialogWrapper from './DialogWrapper.vue'

  type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

  const props = withDefaults(
    defineProps<{
      open: boolean
      title: string
      description?: string
      size?: Size
      submitLabel?: string
      cancelLabel?: string
      loading?: boolean
      disabled?: boolean
      /** When true, hides the built-in Cancel/Submit footer (consumer supplies own via #footer) */
      customFooter?: boolean
    }>(),
    {
      size: 'lg',
      submitLabel: 'Save',
      cancelLabel: 'Cancel',
      loading: false,
      disabled: false,
      customFooter: false,
    },
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: []
    cancel: []
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const close = () => {
    emit('cancel')
    openModel.value = false
  }

  const submit = () => emit('submit')
</script>

<template>
  <DialogWrapper v-model:open="openModel" :title="title" :size="size" body-class="p-4" show-footer>
    <Card class="overflow-hidden p-0 shadow-sm">
      <!-- Optional description band -->
      <div
        v-if="description"
        class="from-primary-50 to-background border-b border-neutral-100 bg-linear-to-b px-6 py-4"
      >
        <p class="body-m text-muted-foreground">{{ description }}</p>
      </div>

      <!-- Form sections -->
      <form class="flex flex-col" @submit.prevent="submit">
        <slot />

        <!-- Hidden submit for Enter-to-submit -->
        <button type="submit" class="hidden" tabindex="-1" aria-hidden="true" />
      </form>
    </Card>

    <template #footer>
      <slot name="footer">
        <template v-if="!customFooter">
          <Button variant="secondary" :disabled="loading" @click="close">
            {{ cancelLabel }}
          </Button>
          <Button
            variant="primary"
            :disabled="disabled || loading"
            :loading="loading"
            @click="submit"
          >
            {{ submitLabel }}
          </Button>
        </template>
      </slot>
    </template>
  </DialogWrapper>
</template>
