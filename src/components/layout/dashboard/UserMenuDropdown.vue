<script setup lang="ts">
  import { LogOut } from 'lucide-vue-next'
  import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  } from '@/components/ui/dropdown-menu'
  import type { UserRole } from '@/config/navigation'

  interface Props {
    userName: string
    userEmail?: string
    userRole?: UserRole
  }

  defineProps<Props>()

  const emit = defineEmits<{
    logout: []
  }>()
</script>

<template>
  <DropdownMenuContent align="end" class="w-56">
    <!-- User Info -->
    <DropdownMenuLabel class="font-normal">
      <div class="flex flex-col space-y-1">
        <p class="text-sm leading-none font-medium">{{ userName }}</p>
        <p v-if="userEmail" class="text-muted-foreground text-xs leading-none">
          {{ userEmail }}
        </p>
        <p v-if="userRole" class="text-muted-foreground text-xs leading-none capitalize">
          {{ userRole }}
        </p>
      </div>
    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuItem @click="emit('logout')" class="text-destructive focus:text-destructive">
      <LogOut class="mr-2 h-4 w-4" />
      <span>Logout</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</template>
