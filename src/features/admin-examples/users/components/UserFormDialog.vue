<script setup lang="ts">
  import { computed } from 'vue'
  import { FormDialog } from '@/components/ui/dialog/composite'
  import type { UserFormValues } from '../types'
  import UserFormPanel from './UserFormPanel.vue'

  const props = defineProps<{
    open: boolean
    mode: 'create' | 'edit'
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    submit: []
  }>()

  const model = defineModel<UserFormValues>('form', { required: true })

  const openModel = computed({
    get: () => props.open,
    set: v => emit('update:open', v),
  })

  const title = computed(() => (props.mode === 'create' ? 'User · Invite' : 'User · Edit'))
  const description = computed(() =>
    props.mode === 'create' ? 'Invite a new team member.' : 'Update user information.',
  )
  const submitLabel = computed(() => (props.mode === 'create' ? 'Send invite' : 'Save changes'))
</script>

<template>
  <FormDialog
    v-model:open="openModel"
    :title="title"
    :description="description"
    :submit-label="submitLabel"
    :loading="loading"
    @submit="emit('submit')"
  >
    <UserFormPanel v-model="model" @submit="emit('submit')" />
  </FormDialog>
</template>
