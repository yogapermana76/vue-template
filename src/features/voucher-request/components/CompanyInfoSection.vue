<script setup lang="ts">
  import { Field } from 'vee-validate'
  import { Building2 } from 'lucide-vue-next'
  import { TextField } from '@/components/ui/form'
  import { SectionHeader } from '@/components/shared'

  defineProps<{ disabled?: boolean }>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <SectionHeader title="Informasi Perusahaan" :icon="Building2" size="md" />

    <Field v-slot="{ value, handleChange, errorMessage }" name="companyName">
      <TextField
        id="companyName"
        :model-value="value"
        label="Nama Perusahaan"
        placeholder="Tulis nama perusahaan"
        required
        :error="errorMessage"
        :disabled="disabled"
        @update:model-value="handleChange"
      />
    </Field>
  </section>
</template>
