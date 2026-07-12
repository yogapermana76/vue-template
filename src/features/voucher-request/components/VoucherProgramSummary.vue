<script setup lang="ts">
  import { useField } from 'vee-validate'
  import { CalendarClock } from 'lucide-vue-next'
  import { SectionHeader } from '@/components/shared'
  import { TextField } from '@/components/ui/form'
  import { SelectOptionField } from '@/components/ui/native-select'
  import type { TicketCategoryOption } from '../types'

  defineProps<{
    programName: string
    ticketCategoryOptions: TicketCategoryOption[]
    disabled?: boolean
  }>()

  // `validateOnValueUpdate: false` waits until blur/submit so opening the
  // select + picking an option doesn't flash a "wajib" error.
  const { value: ticketCategory, errorMessage } = useField<string>('ticketCategory', undefined, {
    validateOnValueUpdate: false,
  })
</script>

<template>
  <section class="flex flex-col gap-4">
    <SectionHeader title="Informasi Program" :icon="CalendarClock" size="md" />

    <TextField id="program" :model-value="programName" label="Program" readonly disabled />

    <SelectOptionField
      id="ticketCategory"
      v-model="ticketCategory"
      label="Pilih Kategori"
      placeholder="Pilih kategori"
      :options="ticketCategoryOptions"
      required
      :error="errorMessage"
      :disabled="disabled"
    />
  </section>
</template>
