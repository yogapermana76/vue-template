<script setup lang="ts">
  import { Building2, Mail, Phone, User } from 'lucide-vue-next'
  import type { SubmissionDetail } from '../../types'
  import SubmissionIdentityHero from './SubmissionIdentityHero.vue'
  import SubmissionIdentityField from './SubmissionIdentityField.vue'

  defineProps<{
    detail: SubmissionDetail
  }>()
</script>

<template>
  <aside
    class="bg-card shadow-card relative min-w-0 overflow-hidden rounded-lg border border-neutral-200"
  >
    <SubmissionIdentityHero :detail="detail" />

    <dl class="grid gap-4 px-5 py-5 sm:grid-cols-2">
      <SubmissionIdentityField :icon="User" label="Nama" :value="detail.name" />
      <SubmissionIdentityField
        :icon="Phone"
        label="Nomor HP"
        :value="detail.phone"
        value-class="truncate tabular-nums"
      />
      <SubmissionIdentityField
        :icon="Mail"
        label="Email"
        :value="detail.email"
        value-class="break-all"
        class="sm:col-span-2"
      />
      <SubmissionIdentityField
        :icon="Building2"
        label="Perusahaan/Komunitas"
        :value="detail.company"
        class="sm:col-span-2"
      />
    </dl>
  </aside>
</template>
