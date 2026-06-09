<script setup lang="ts">
  import { ChevronDown } from 'lucide-vue-next'
  import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
  import UserAvatarButton from './UserAvatarButton.vue'
  import UserInfoText from './UserInfoText.vue'
  import UserMenuDropdown from './UserMenuDropdown.vue'
  import type { UserRole } from '@/config/navigation'

  interface Props {
    /** User display name */
    userName: string
    /** User email */
    userEmail?: string
    /** Current user role */
    userRole: UserRole
    /** User avatar URL */
    userAvatar?: string
    /** Show user info text (name, email, role) */
    showUserInfo?: boolean
  }

  withDefaults(defineProps<Props>(), {
    showUserInfo: true,
  })

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
        class="-mx-2 -my-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5"
      >
        <!-- Avatar -->
        <UserAvatarButton :user-name="userName" :user-avatar="userAvatar" />

        <!-- User Info Text (Desktop only) -->
        <UserInfoText
          v-if="showUserInfo"
          :user-name="userName"
          :user-email="userEmail"
          :user-role="userRole"
          class="hidden lg:block"
        />

        <!-- Chevron Icon (Desktop only) -->
        <ChevronDown
          v-if="showUserInfo"
          class="text-muted-foreground hidden h-4 w-4 shrink-0 lg:block"
        />
      </button>
    </DropdownMenuTrigger>

    <!-- Dropdown Menu -->
    <UserMenuDropdown
      :user-name="userName"
      :user-email="userEmail"
      :user-role="userRole"
      @logout="emit('logout')"
      @settings="emit('settings')"
      @help="emit('help')"
    />
  </DropdownMenu>
</template>
