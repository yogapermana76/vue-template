<script setup lang="ts">
  import { User } from 'lucide-vue-next'

  interface Props {
    /** User's display name */
    userName: string
    /** User's avatar URL */
    userAvatar?: string
  }

  defineProps<Props>()
</script>

<template>
  <div class="flex size-10 shrink-0 items-center justify-center rounded-full">
    <!-- Avatar Image -->
    <div v-if="userAvatar" class="size-full overflow-hidden rounded-full">
      <img :src="userAvatar" :alt="userName" class="size-full object-cover" />
    </div>

    <!-- Fallback Avatar -->
    <div
      v-else
      class="bg-primary text-primary-foreground border-border flex size-full items-center justify-center rounded-full border"
    >
      <User class="size-5" />
    </div>
  </div>
</template>
