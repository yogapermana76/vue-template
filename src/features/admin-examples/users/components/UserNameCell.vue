<script setup lang="ts">
  import UserAvatar from './UserAvatar.vue'
  import type { User } from '../types'

  defineProps<{
    user: User
  }>()
</script>

<template>
  <div class="flex items-center gap-3">
    <UserAvatar :name="user.name" />
    <div class="min-w-0">
      <p class="body-m-semibold text-foreground truncate">{{ user.name }}</p>
      <p class="body-caption text-muted-foreground truncate">{{ user.email }}</p>
    </div>
  </div>
</template>
