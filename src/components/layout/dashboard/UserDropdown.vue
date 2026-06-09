<script setup lang="ts">
  import { User, LogOut, Settings, HelpCircle } from 'lucide-vue-next'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import { cn } from '@/utils/cn'

  export interface UserDropdownProps {
    /** User's display name */
    userName: string
    /** User's email */
    userEmail?: string
    /** User's role */
    userRole?: string
    /** User's avatar URL */
    userAvatar?: string
    /** Custom class for avatar container */
    class?: string
  }

  defineProps<UserDropdownProps>()

  const emit = defineEmits<{
    logout: []
    settings: []
    help: []
  }>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        :class="
          cn(
            'focus-visible:ring-ring flex size-10 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            $attrs.class,
          )
        "
      >
        <!-- Avatar Image or Fallback -->
        <div v-if="userAvatar" class="size-full overflow-hidden rounded-full">
          <img :src="userAvatar" :alt="userName" class="size-full object-cover" />
        </div>
        <div
          v-else
          class="bg-primary text-primary-foreground border-border flex size-full items-center justify-center rounded-full border-2"
        >
          <User class="size-5" />
        </div>
      </button>
    </DropdownMenuTrigger>

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

      <!-- Menu Items -->
      <DropdownMenuItem @click="emit('settings')">
        <Settings class="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>

      <DropdownMenuItem @click="emit('help')">
        <HelpCircle class="mr-2 h-4 w-4" />
        <span>Help & Support</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="emit('logout')" class="text-destructive focus:text-destructive">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
