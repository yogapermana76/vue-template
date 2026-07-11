<script setup lang="ts">
  import { computed } from 'vue'
  import { Pencil } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { DetailSheet } from '@/components/ui/side-sheet'
  import type { Product } from '../types'
  import ProductDetailPanel from './ProductDetailPanel.vue'
  import ProductStatusBadge from './ProductStatusBadge.vue'

  const props = defineProps<{
    open: boolean
    product: Product | null
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    edit: [product: Product]
  }>()

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const close = () => (openModel.value = false)
  const handleEdit = () => {
    if (props.product) emit('edit', props.product)
  }
</script>

<template>
  <DetailSheet v-model:open="openModel" :title="product?.name" :subtitle="product?.sku" width="md">
    <template v-if="product" #badges>
      <ProductStatusBadge :status="product.status" />
    </template>

    <ProductDetailPanel v-if="product" :product="product" />

    <template #footer>
      <Button variant="secondary" @click="close">Close</Button>
      <Button v-if="product" variant="primary" @click="handleEdit">
        <Pencil class="size-4" />
        Edit
      </Button>
    </template>
  </DetailSheet>
</template>
