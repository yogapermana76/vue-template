<script setup lang="ts">
  import { computed } from 'vue'
  import { User } from 'lucide-vue-next'
  import { SidebarNavItem } from '@/components/layout/dashboard'
  import { filterNavByRole, type UserRole, type NavItem } from '@/config/navigation'

  interface Props {
    /** Footer navigation items */
    footerItems: NavItem[]
    /** Current user role for filtering */
    userRole: UserRole
    /** Whether sidebar is collapsed */
    collapsed?: boolean
    /** User display name */
    userName?: string
    /** User email */
    userEmail?: string
    /** User avatar URL */
    userAvatar?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
    userName: 'User',
  })

  const emit = defineEmits<{
    logout: []
    itemClick: [itemId: string]
  }>()

  // Filter footer items based on role
  const filteredFooterItems = computed(() => filterNavByRole(props.footerItems, props.userRole))

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      emit('logout')
    } else {
      emit('itemClick', itemId)
    }
  }
</script>

<template>
  <!-- User Profile (above other footer items) -->
  <div v-if="!collapsed" class="mb-4 flex items-center gap-3 rounded-lg bg-white/10 p-2">
    <div v-if="userAvatar" class="size-9 shrink-0 overflow-hidden rounded-full">
      <img :src="userAvatar" :alt="userName" class="size-full object-cover" />
    </div>
    <div
      v-else
      class="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
    >
      <User class="h-4 w-4" />
    </div>
    <div class="flex-1 overflow-hidden">
      <p class="truncate text-sm font-medium text-white">{{ userName }}</p>
      <p v-if="userEmail" class="truncate text-xs text-white/60">{{ userEmail }}</p>
      <p v-else class="truncate text-xs text-white/60 capitalize">{{ userRole }}</p>
    </div>
  </div>

  <!-- Footer Navigation Items -->
  <div class="space-y-1">
    <SidebarNavItem
      v-for="item in filteredFooterItems"
      :key="item.id"
      :to="item.to"
      :icon="item.icon"
      :label="item.label"
      :collapsed="collapsed"
      @click="handleItemClick(item.id)"
    />
  </div>
</template>
