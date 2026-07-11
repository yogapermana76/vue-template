<script setup lang="ts">
  import { computed } from 'vue'
  import { Switch } from '@/components/ui/switch'
  import { FormDialog } from '@/components/ui/dialog/composite'
  import { FormSection } from '@/components/ui/side-sheet'
  import { TextField } from '@/components/ui/form'
  import { SelectOptionField } from '@/components/ui/native-select'
  import { categoryParentOptions } from '../constants'
  import type { CategoryFormValues } from '../types'

  const props = defineProps<{
    open: boolean
    mode: 'create' | 'edit'
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: []
    'auto-slug': []
  }>()

  const model = defineModel<CategoryFormValues>('form', { required: true })

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const title = computed(() => (props.mode === 'create' ? 'Category · New' : 'Category · Edit'))
  const description = computed(() =>
    props.mode === 'create'
      ? 'Group related products for easier browsing.'
      : 'Update this category’s metadata.',
  )
  const submitLabel = computed(() => (props.mode === 'create' ? 'Create' : 'Save'))
</script>

<template>
  <FormDialog
    v-model:open="openModel"
    :title="title"
    :description="description"
    :submit-label="submitLabel"
    :loading="loading"
    size="md"
    @submit="emit('submit')"
  >
    <FormSection title="Details" :columns="1">
      <TextField
        v-model="model.name"
        label="Name"
        placeholder="e.g. Wireless Audio"
        required
        @blur="emit('auto-slug')"
      />
      <TextField
        v-model="model.slug"
        label="Slug"
        placeholder="wireless-audio"
        helper="URL identifier — auto-generated from name."
        required
      />
      <SelectOptionField
        v-model="model.parent"
        label="Parent category"
        :options="categoryParentOptions"
        placeholder="No parent"
      />

      <div
        class="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2.5"
      >
        <div>
          <p class="body-m-medium text-foreground">Published</p>
          <p class="body-caption text-muted-foreground">Visible in the storefront navigation.</p>
        </div>
        <Switch v-model="model.isPublished" />
      </div>
    </FormSection>
  </FormDialog>
</template>
