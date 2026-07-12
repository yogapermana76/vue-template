<script setup lang="ts">
  import { Field } from 'vee-validate'
  import { UserRound } from 'lucide-vue-next'
  import { TextField } from '@/components/ui/form'
  import { SectionHeader } from '@/components/shared'

  defineProps<{ disabled?: boolean }>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <SectionHeader title="Informasi Diri" :icon="UserRound" size="md" />

    <div class="flex flex-col gap-4">
      <Field v-slot="{ value, handleChange, errorMessage }" name="fullName">
        <TextField
          id="fullName"
          :model-value="value"
          label="Nama"
          placeholder="Masukkan nama lengkap Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
          @update:model-value="handleChange"
        />
      </Field>

      <Field v-slot="{ value, handleChange, errorMessage }" name="phone">
        <TextField
          id="phone"
          :model-value="value"
          label="Nomor HP"
          type="tel"
          placeholder="Masukkan nomor HP aktif Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
          @update:model-value="handleChange"
        />
      </Field>

      <Field v-slot="{ value, handleChange, errorMessage }" name="email">
        <TextField
          id="email"
          :model-value="value"
          label="Email"
          type="email"
          placeholder="Masukkan email aktif Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
          @update:model-value="handleChange"
        />
      </Field>
    </div>
  </section>
</template>
