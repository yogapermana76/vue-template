<script setup lang="ts">
  import { computed } from 'vue'
  import { CrudFormSheet, FormSection } from '@/components/ui/side-sheet'
  import { TextField } from '@/components/ui/form'
  import { SelectOptionField } from '@/components/ui/native-select'
  import { voucherKindOptions, voucherStatusOptions } from '../constants'
  import type { VoucherFormValues } from '../types'

  const props = defineProps<{
    open: boolean
    mode: 'create' | 'edit'
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: []
  }>()

  const model = defineModel<VoucherFormValues>('form', { required: true })

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const title = computed(() => (props.mode === 'create' ? 'New voucher' : 'Edit voucher'))
  const description = computed(() =>
    props.mode === 'create' ? 'Configure a new promotion.' : 'Update voucher parameters.',
  )
  const submitLabel = computed(() => (props.mode === 'create' ? 'Create voucher' : 'Save changes'))
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
    <FormSection title="Identity">
      <TextField
        v-model="model.code"
        label="Voucher code"
        placeholder="SUMMER25"
        required
        class="uppercase"
      />
      <SelectOptionField
        v-model="model.status"
        label="Status"
        :options="voucherStatusOptions"
        placeholder="Select status"
      />
      <TextField
        v-model="model.description"
        label="Description"
        placeholder="What is this voucher for?"
        class="sm:col-span-2"
      />
    </FormSection>

    <FormSection title="Value">
      <SelectOptionField v-model="model.kind" label="Voucher type" :options="voucherKindOptions" />
      <TextField
        v-model.number="model.amount"
        label="Value"
        type="number"
        :helper="model.kind === 'percentage' ? 'Percentage 0–100' : 'Amount in USD'"
      />
      <TextField
        v-model.number="model.minSpend"
        label="Minimum spend"
        type="number"
        format="currency"
      />
      <TextField
        v-model.number="model.usageLimit"
        label="Usage limit"
        type="number"
        helper="Maximum redemptions."
      />
    </FormSection>

    <FormSection title="Schedule">
      <TextField v-model="model.startsAt" label="Starts on" type="date" required />
      <TextField v-model="model.endsAt" label="Ends on" type="date" required />
    </FormSection>
  </CrudFormSheet>
</template>
