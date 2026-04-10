<script setup lang="ts">
  import { LogOut } from 'lucide-vue-next'
  import { IconButton } from '@/components/ui/button'
  import { Header } from '@/components/layout'

  interface Props {
    title?: string
    userName?: string
    positioning?: 'fixed' | 'sticky' | 'normal'
  }

  withDefaults(defineProps<Props>(), {
    title: 'Dashboard',
    userName: 'User',
    positioning: 'normal',
  })

  const emit = defineEmits<{
    logout: []
  }>()
</script>

<template>
  <Header
    :title="title"
    :subtitle="`Welcome, ${userName}`"
    :show-back="false"
    :positioning="positioning"
  >
    <template #actions>
      <IconButton variant="secondary" size="md" title="Logout" @click="emit('logout')">
        <LogOut />
      </IconButton>
    </template>
  </Header>
</template>
