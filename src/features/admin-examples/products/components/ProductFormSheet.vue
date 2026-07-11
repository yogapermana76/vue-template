<script setup lang="ts">
  import { computed } from 'vue'
  import { CrudFormSheet } from '@/components/ui/side-sheet'
  import type { ProductFormValues } from '../types'
  import ProductFormPanel from './ProductFormPanel.vue'

  const props = defineProps<{
    open: boolean
    mode: 'create' | 'edit'
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: []
  }>()

  const model = defineModel<ProductFormValues>('form', { required: true })

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const title = computed(() => (props.mode === 'create' ? 'Add product' : 'Edit product'))
  const description = computed(() =>
    props.mode === 'create' ? 'Create a new product entry.' : 'Update product information.',
  )
  const submitLabel = computed(() => (props.mode === 'create' ? 'Create product' : 'Save changes'))
</script>

<template>
  <CrudFormSheet
    v-model:open="openModel"
    :title="title"
    :description="description"
    :submit-label="submitLabel"
    :loading="loading"
    width="lg"
    @submit="emit('submit')"
  >
    <ProductFormPanel v-model="model" @submit="emit('submit')" />
  </CrudFormSheet>
</template>
