<script setup lang="ts">
  import type { ConfirmDialogButton } from '@/components/ui/dialog/composite'
  import { computed } from 'vue'
  import { Ban, Check, Send, Trash2 } from 'lucide-vue-next'

  definePage({
    meta: {
      breadcrumbs: [
        { label: 'Home', to: '/docs/admin-examples/overview' },
        { label: 'Invoices', to: '/docs/admin-examples/invoices' },
        { label: 'Detail' },
      ],
    },
  })

  import { Button } from '@/components/ui/button'
  import { Card } from '@/components/ui/card'
  import { ConfirmDialog } from '@/components/ui/dialog/composite'
  import { DetailPageLayout, PageHeader } from '@/components/layout'
  import { DetailField, DetailSection } from '@/components/ui/side-sheet'
  import { formatCurrency, type CurrencyCode } from '@/utils/currency'
  import { formatDate } from '@/utils/date'
  import {
    InvoiceItemsTable,
    InvoiceStatusBadge,
    InvoiceTimeline,
    useInvoiceDetail,
  } from '@/features/admin-examples/invoices'

  const detail = useInvoiceDetail()

  const money = (v: number, c: string) => formatCurrency(v, c as CurrencyCode)
  const date = (v: string) => formatDate(v, 'dd MMM yyyy')

  const canSend = computed(() =>
    ['draft', 'sent', 'overdue'].includes(detail.invoice.value?.status ?? ''),
  )
  const canMarkPaid = computed(() =>
    ['sent', 'overdue'].includes(detail.invoice.value?.status ?? ''),
  )
  const canVoid = computed(() =>
    ['draft', 'sent', 'overdue'].includes(detail.invoice.value?.status ?? ''),
  )

  const deleteButtons = computed<ConfirmDialogButton[]>(() => [
    {
      label: 'Cancel',
      variant: 'secondary',
      disabled: detail.deleteLoading.value,
      onClick: () => (detail.confirmOpen.value = false),
    },
    {
      label: 'Delete invoice',
      variant: 'danger',
      loading: detail.deleteLoading.value,
      onClick: detail.confirmDelete,
    },
  ])
</script>

<template>
  <DetailPageLayout
    :not-found="!detail.invoice.value"
    not-found-title="Invoice not found"
    not-found-description="The invoice you are looking for does not exist or has been removed."
    not-found-back-label="Back to invoices"
    :aside-width="360"
    @back="detail.back"
  >
    <template v-if="detail.invoice.value" #header>
      <PageHeader
        :title="detail.invoice.value.number"
        :subtitle="detail.invoice.value.clientName"
        back
        @back="detail.back"
      >
        <template #badges>
          <InvoiceStatusBadge :status="detail.invoice.value.status" />
        </template>

        <template #meta>
          Issued {{ date(detail.invoice.value.issueDate) }} · Due
          {{ date(detail.invoice.value.dueDate) }}
        </template>

        <template #actions>
          <Button v-if="canVoid" variant="warning" soft size="md" @click="detail.voidInvoice">
            <Ban class="size-4" />
            Void
          </Button>
          <Button variant="danger" soft size="md" @click="detail.openDelete">
            <Trash2 class="size-4" />
            Delete
          </Button>
          <Button
            v-if="canSend"
            variant="secondary"
            size="md"
            :loading="detail.sending.value"
            @click="detail.sendInvoice"
          >
            <Send class="size-4" />
            Send
          </Button>
          <Button
            v-if="canMarkPaid"
            variant="success"
            size="md"
            :loading="detail.markingPaid.value"
            @click="detail.markPaid"
          >
            <Check class="size-4" />
            Mark paid
          </Button>
        </template>
      </PageHeader>
    </template>

    <template v-if="detail.invoice.value" #main>
      <Card class="overflow-hidden p-0">
        <DetailSection title="Bill to">
          <DetailField label="Client" :value="detail.invoice.value.clientName" />
          <DetailField label="Email" :value="detail.invoice.value.clientEmail" />
          <DetailField label="Address" :value="detail.invoice.value.clientAddress" wide />
          <DetailField v-if="detail.invoice.value.notes" label="Notes" wide>
            {{ detail.invoice.value.notes }}
          </DetailField>
        </DetailSection>
      </Card>

      <InvoiceItemsTable
        :items="detail.invoice.value.items"
        :subtotal="detail.invoice.value.subtotal"
        :tax-rate="detail.invoice.value.taxRate"
        :tax="detail.invoice.value.tax"
        :total="detail.invoice.value.total"
        :currency="detail.invoice.value.currency"
      />
    </template>

    <template v-if="detail.invoice.value" #aside>
      <Card class="overflow-hidden p-0">
        <DetailSection title="Summary" :columns="1">
          <DetailField label="Status">
            <InvoiceStatusBadge :status="detail.invoice.value.status" />
          </DetailField>
          <DetailField
            label="Amount due"
            :value="money(detail.invoice.value.total, detail.invoice.value.currency)"
          />
          <DetailField label="Issued" :value="date(detail.invoice.value.issueDate)" />
          <DetailField label="Due" :value="date(detail.invoice.value.dueDate)" />
        </DetailSection>
      </Card>

      <InvoiceTimeline :events="detail.invoice.value.timeline" />
    </template>

    <template v-if="detail.invoice.value" #modals>
      <ConfirmDialog
        v-model:open="detail.confirmOpen.value"
        variant="danger"
        title="Delete invoice?"
        :description="`Invoice ${detail.invoice.value.number} will be permanently deleted.`"
        :buttons="deleteButtons"
      />
    </template>
  </DetailPageLayout>
</template>
