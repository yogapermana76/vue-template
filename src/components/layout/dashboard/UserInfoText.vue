<script setup lang="ts">
  import type { UserRole } from '@/config/navigation'

  interface Props {
    /** User display name */
    userName: string
    /** User email */
    userEmail?: string
    /** User role */
    userRole?: UserRole
  }

  defineProps<Props>()
</script>

<template>
  <div class="text-left">
    <p class="text-foreground text-sm font-medium">{{ userName }}</p>
    <p v-if="userEmail" class="text-muted-foreground text-xs">{{ userEmail }}</p>
    <p v-else-if="userRole" class="text-muted-foreground text-xs capitalize">{{ userRole }}</p>
  </div>
</template>
