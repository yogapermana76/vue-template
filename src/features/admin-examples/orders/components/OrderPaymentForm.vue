<script setup lang="ts">
  import { FormSection } from '@/components/ui/side-sheet'
  import { SelectOptionField } from '@/components/ui/native-select'
  import { orderPaymentOptions, orderStatusOptions } from '../constants'
  import type { OrderPaymentMethod, OrderStatus } from '../types'

  interface PaymentFormValues {
    status: OrderStatus
    paymentMethod: OrderPaymentMethod
  }

  const model = defineModel<PaymentFormValues>({ required: true })
</script>

<template>
  <FormSection title="Payment & Status" :columns="1">
    <SelectOptionField v-model="model.status" label="Status" :options="orderStatusOptions" />
    <SelectOptionField
      v-model="model.paymentMethod"
      label="Payment method"
      :options="orderPaymentOptions"
    />
  </FormSection>
</template>
