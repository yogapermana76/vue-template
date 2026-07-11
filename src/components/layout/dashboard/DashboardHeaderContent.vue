<script setup lang="ts">
  import { ChevronDown } from 'lucide-vue-next'
  import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
  import UserAvatarButton from './UserAvatarButton.vue'
  import UserInfoText from './UserInfoText.vue'
  import UserMenuDropdown from './UserMenuDropdown.vue'
  import type { UserRole } from '@/config/navigation'

  interface Props {
    userName: string
    userEmail?: string
    userRole: UserRole
    userAvatar?: string
    /** Show user info text (name, email, role) */
    showUserInfo?: boolean
  }

  withDefaults(defineProps<Props>(), {
    showUserInfo: true,
  })

  const emit = defineEmits<{
    logout: []
  }>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <!-- Trigger: on <lg only the avatar is shown, so the pill wrapper
           (border + padding + bg) would double-frame the avatar. Strip
           the wrapper styling on mobile and re-apply from `lg:` up where
           the info text + chevron give the pill something to hold. -->
      <button
        type="button"
        class="flex cursor-pointer items-center gap-2.5 rounded-full transition-colors lg:border lg:border-transparent lg:py-1 lg:pr-3 lg:pl-1 lg:hover:border-neutral-200 lg:hover:bg-white lg:data-[state=open]:border-neutral-200 lg:data-[state=open]:bg-white"
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
    />
  </DropdownMenu>
</template>
