<script setup lang="ts">
  import { FormSection } from '@/components/ui/side-sheet'
  import { TextField, TextAreaField } from '@/components/ui/form'

  interface CustomerFormValues {
    customerName: string
    customerEmail: string
    shippingAddress: string
    notes: string
  }

  const model = defineModel<CustomerFormValues>({ required: true })
</script>

<template>
  <FormSection title="Customer">
    <TextField v-model="model.customerName" label="Customer name" required />
    <TextField v-model="model.customerEmail" label="Email" type="email" required />
    <TextAreaField
      v-model="model.shippingAddress"
      label="Shipping address"
      :rows="2"
      class="sm:col-span-2"
      required
    />
    <TextAreaField v-model="model.notes" label="Notes" :rows="2" class="sm:col-span-2" />
  </FormSection>
</template>
