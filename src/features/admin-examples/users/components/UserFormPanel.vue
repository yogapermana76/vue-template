<script setup lang="ts">
  import { FormSection } from '@/components/ui/side-sheet'
  import { TextField } from '@/components/ui/form'
  import { SelectOptionField } from '@/components/ui/native-select'
  import { userDepartmentOptions, userRoleOptions, userStatusOptions } from '../constants'
  import type { UserFormValues } from '../types'

  const model = defineModel<UserFormValues>({ required: true })

  defineEmits<{
    submit: []
  }>()
</script>

<template>
  <form class="flex flex-col" @submit.prevent="$emit('submit')">
    <FormSection title="Profile">
      <TextField
        v-model="model.name"
        label="Full name"
        placeholder="e.g. Ayu Pertiwi"
        required
        class="sm:col-span-2"
      />
      <TextField
        v-model="model.email"
        label="Email"
        type="email"
        placeholder="user@example.com"
        required
      />
      <TextField v-model="model.phone" label="Phone" placeholder="+62 8xx xxxx xxxx" />
    </FormSection>

    <FormSection title="Access">
      <SelectOptionField
        v-model="model.role"
        label="Role"
        :options="userRoleOptions"
        placeholder="Select role"
        required
      />
      <SelectOptionField
        v-model="model.status"
        label="Status"
        :options="userStatusOptions"
        placeholder="Select status"
      />
      <SelectOptionField
        v-model="model.department"
        label="Department"
        :options="userDepartmentOptions"
        placeholder="Select department"
      />
    </FormSection>

    <button type="submit" class="hidden" tabindex="-1" aria-hidden="true" />
  </form>
</template>
