<script setup lang="ts">
  import { LogOut } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
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
    :hide-theme-toggle="true"
  >
    <template #actions>
      <Button
        variant="outline"
        size="icon"
        class="border-primary-300 text-primary-600 hover:bg-primary-50 size-9"
        @click="emit('logout')"
      >
        <LogOut class="size-4" />
      </Button>
    </template>
  </Header>
</template>
