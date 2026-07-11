<script setup lang="ts">
  import { computed } from 'vue'
  import { Pencil, Save, Trash2, X } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Home', to: '/docs/admin-examples/overview' },
        { label: 'Orders', to: '/docs/admin-examples/orders' },
        { label: 'Detail' },
      ],
    },
  })

  import type { ConfirmDialogButton } from '@/components/ui/dialog/composite'
  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import { DetailPageLayout, PageHeader } from '@/components/layout'
  import { formatDate } from '@/utils/date'
  import {
    OrderCustomerDetail,
    OrderCustomerForm,
    OrderItemsCard,
    OrderPaymentDetail,
    OrderPaymentForm,
    OrderStatusBadge,
    useOrderDetail,
  } from '@/features/admin-examples/orders'

  const detail = useOrderDetail()

  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  // Split form buffer into two smaller model wrappers so each sub-form only sees its concern.
  const customerForm = computed({
    get: () => ({
      customerName: detail.form.value.customerName,
      customerEmail: detail.form.value.customerEmail,
      shippingAddress: detail.form.value.shippingAddress,
      notes: detail.form.value.notes,
    }),
    set: v => {
      detail.form.value.customerName = v.customerName
      detail.form.value.customerEmail = v.customerEmail
      detail.form.value.shippingAddress = v.shippingAddress
      detail.form.value.notes = v.notes
    },
  })

  const paymentForm = computed({
    get: () => ({
      status: detail.form.value.status,
      paymentMethod: detail.form.value.paymentMethod,
    }),
    set: v => {
      detail.form.value.status = v.status
      detail.form.value.paymentMethod = v.paymentMethod
    },
  })

  const deleteButtons = computed<ConfirmDialogButton[]>(() => [
    {
      label: 'Cancel',
      variant: 'secondary',
      disabled: detail.deleteLoading.value,
      onClick: () => (detail.confirmOpen.value = false),
    },
    {
      label: 'Delete order',
      variant: 'danger',
      loading: detail.deleteLoading.value,
      onClick: detail.confirmDelete,
    },
  ])
</script>

<template>
  <DetailPageLayout
    :not-found="!detail.order.value"
    not-found-title="Order not found"
    not-found-description="The order you are looking for does not exist or has been removed."
    not-found-back-label="Back to orders"
    :aside-width="380"
    @back="detail.back"
  >
    <template v-if="detail.order.value" #header>
      <PageHeader
        :title="detail.order.value.id"
        :subtitle="detail.order.value.customerName"
        back
        @back="detail.back"
      >
        <template #badges>
          <OrderStatusBadge :status="detail.order.value.status" />
        </template>

        <template #meta>
          Created {{ date(detail.order.value.createdAt) }} · Updated
          {{ date(detail.order.value.updatedAt) }}
        </template>

        <template #actions>
          <template v-if="!detail.isEditing.value">
            <Button variant="danger" soft @click="detail.openDelete">
              <Trash2 class="size-4" />
              Delete
            </Button>
            <Button variant="primary" @click="detail.enterEdit">
              <Pencil class="size-4" />
              Edit
            </Button>
          </template>
          <template v-else>
            <Button variant="secondary" :disabled="detail.saving.value" @click="detail.exitEdit">
              <X class="size-4" />
              Cancel
            </Button>
            <Button variant="primary" :disabled="detail.saving.value" @click="detail.save">
              <Save class="size-4" />
              <span v-if="detail.saving.value">Saving…</span>
              <span v-else>Save changes</span>
            </Button>
          </template>
        </template>
      </PageHeader>
    </template>

    <template v-if="detail.order.value" #main>
      <Card class="overflow-hidden p-0">
        <OrderCustomerDetail v-if="!detail.isEditing.value" :order="detail.order.value" />
        <OrderCustomerForm v-else v-model="customerForm" />
      </Card>
      <OrderItemsCard
        :items="detail.order.value.items"
        :total-amount="detail.order.value.totalAmount"
      />
    </template>

    <template v-if="detail.order.value" #aside>
      <Card class="overflow-hidden p-0">
        <OrderPaymentDetail v-if="!detail.isEditing.value" :order="detail.order.value" />
        <OrderPaymentForm v-else v-model="paymentForm" />
      </Card>
    </template>

    <template v-if="detail.order.value" #modals>
      <ConfirmDialog
        v-model:open="detail.confirmOpen.value"
        variant="danger"
        title="Delete order?"
        :description="`Order “${detail.order.value.id}” will be permanently removed. This action cannot be undone.`"
        :buttons="deleteButtons"
      />
    </template>
  </DetailPageLayout>
</template>
