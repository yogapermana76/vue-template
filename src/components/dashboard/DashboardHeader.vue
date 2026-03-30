<script setup lang="ts">
  import { LogOut } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  interface Props {
    title?: string
    userName?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Dashboard',
    userName: 'User',
  })

  const emit = defineEmits<{
    logout: []
  }>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <p class="text-muted-foreground text-sm">Welcome, {{ userName }}</p>
    </div>
    <Button variant="outline" size="icon" class="size-9" @click="emit('logout')">
      <LogOut class="size-4" />
    </Button>
  </div>
</template>
