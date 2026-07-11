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
      <Field v-slot="{ field, errorMessage }" name="fullName">
        <TextField
          id="fullName"
          v-bind="field"
          label="Nama"
          placeholder="Masukkan nama lengkap Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
        />
      </Field>

      <Field v-slot="{ field, errorMessage }" name="phone">
        <TextField
          id="phone"
          v-bind="field"
          label="Nomor HP"
          type="tel"
          placeholder="Masukkan nomor HP aktif Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
        />
      </Field>

      <Field v-slot="{ field, errorMessage }" name="email">
        <TextField
          id="email"
          v-bind="field"
          label="Email"
          type="email"
          placeholder="Masukkan email aktif Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
        />
      </Field>

      <Field v-slot="{ field, errorMessage }" name="nik">
        <TextField
          id="nik"
          v-bind="field"
          label="NIK"
          placeholder="Masukkan nomor identitas Anda"
          required
          :error="errorMessage"
          :disabled="disabled"
        />
      </Field>
    </div>
  </section>
</template>
