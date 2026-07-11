<script setup lang="ts">
  import { Save } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Home', to: '/docs/admin-examples/overview' },
        { label: 'Orders', to: '/docs/admin-examples/orders' },
        { label: 'New order' },
      ],
    },
  })

  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import { PageHeader } from '@/components/layout'
  import { computed } from 'vue'
  import {
    OrderCustomerForm,
    OrderItemsForm,
    OrderPaymentForm,
    useOrderCreate,
  } from '@/features/admin-examples/orders'

  const create = useOrderCreate()

  const customerForm = computed({
    get: () => ({
      customerName: create.form.value.customerName,
      customerEmail: create.form.value.customerEmail,
      shippingAddress: create.form.value.shippingAddress,
      notes: create.form.value.notes ?? '',
    }),
    set: v => {
      create.form.value.customerName = v.customerName
      create.form.value.customerEmail = v.customerEmail
      create.form.value.shippingAddress = v.shippingAddress
      create.form.value.notes = v.notes
    },
  })

  const paymentForm = computed({
    get: () => ({
      status: create.form.value.status,
      paymentMethod: create.form.value.paymentMethod,
    }),
    set: v => {
      create.form.value.status = v.status
      create.form.value.paymentMethod = v.paymentMethod
    },
  })

  const itemsModel = computed({
    get: () => create.form.value.items,
    set: v => (create.form.value.items = v),
  })
</script>

<template>
  <PageHeader
    title="New order"
    subtitle="Create a new order for a customer."
    back
    @back="create.cancel"
  >
    <template #actions>
      <Button variant="secondary" :disabled="create.saving.value" @click="create.cancel">
        Cancel
      </Button>
      <Button variant="primary" :disabled="create.saving.value" @click="create.submit">
        <Save class="size-4" />
        <span v-if="create.saving.value">Saving…</span>
        <span v-else>Create order</span>
      </Button>
    </template>
  </PageHeader>

  <form
    class="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_380px]"
    @submit.prevent="create.submit"
  >
    <div class="flex flex-col gap-5">
      <Card class="overflow-hidden p-0">
        <OrderCustomerForm v-model="customerForm" />
      </Card>

      <OrderItemsForm v-model="itemsModel" :total-amount="create.total()" />
    </div>

    <aside class="flex flex-col gap-5 lg:sticky lg:top-4">
      <Card class="overflow-hidden p-0">
        <OrderPaymentForm v-model="paymentForm" />
      </Card>
    </aside>
  </form>
</template>
