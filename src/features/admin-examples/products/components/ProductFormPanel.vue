<script setup lang="ts">
  import { FormSection } from '@/components/ui/side-sheet'
  import { TextField, TextAreaField } from '@/components/ui/form'
  import { SelectOptionField } from '@/components/ui/native-select'
  import { productCategoryOptions, productStatusOptions } from '../constants'
  import type { ProductFormValues } from '../types'

  const model = defineModel<ProductFormValues>({ required: true })

  defineEmits<{
    submit: []
  }>()
</script>

<template>
  <form class="flex flex-col" @submit.prevent="$emit('submit')">
    <FormSection title="General">
      <TextField
        v-model="model.name"
        label="Product name"
        placeholder="e.g. Wireless Headphones"
        required
        class="sm:col-span-2"
      />
      <TextField v-model="model.sku" label="SKU" placeholder="WH-001" required />
      <TextField v-model="model.brand" label="Brand" placeholder="TechSound" />
      <SelectOptionField
        v-model="model.category"
        label="Category"
        :options="productCategoryOptions"
        placeholder="Select category"
        required
      />
      <SelectOptionField
        v-model="model.status"
        label="Status"
        :options="productStatusOptions"
        placeholder="Select status"
      />
      <TextAreaField
        v-model="model.description"
        label="Description"
        placeholder="Short description of the product"
        class="sm:col-span-2"
        :rows="3"
      />
    </FormSection>

    <FormSection title="Pricing & Stock">
      <TextField
        v-model.number="model.price"
        label="Price"
        type="number"
        format="currency"
        required
      />
      <TextField v-model.number="model.cost" label="Cost" type="number" format="currency" />
      <TextField v-model.number="model.stock" label="Stock" type="number" />
    </FormSection>

    <FormSection title="Fulfillment">
      <TextField v-model="model.supplier" label="Supplier" placeholder="Supplier name" />
      <TextField v-model="model.warehouse" label="Warehouse" placeholder="Warehouse A" />
    </FormSection>

    <button type="submit" class="hidden" tabindex="-1" aria-hidden="true" />
  </form>
</template>
