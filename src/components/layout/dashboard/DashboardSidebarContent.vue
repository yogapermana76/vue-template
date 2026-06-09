<script setup lang="ts">
  import { computed } from 'vue'
  import {
    SidebarNavItem,
    SidebarNavGroup,
    SidebarNavItemCollapsible,
    SidebarNavDropdown,
  } from '@/components/layout/dashboard'
  import { filterNavByRole, type UserRole, type NavItem, type NavGroup } from '@/config/navigation'

  interface Props {
    /** Navigation groups to display */
    navGroups: NavGroup[]
    /** Current user role for filtering */
    userRole: UserRole
    /** Whether sidebar is collapsed */
    collapsed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
  })

  // Filter navigation based on role
  const filteredNavGroups = computed(() =>
    filterNavByRole(props.navGroups, props.userRole).map(group => ({
      ...group,
      items: filterNavByRole(group.items, props.userRole),
    })),
  )

  // Get child routes for collapsible items (to highlight active parent)
  const getChildRoutes = (item: NavItem): string[] => {
    if (!item.children) return []
    return item.children.filter(c => c.to).map(c => c.to as string)
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Navigation Groups -->
    <template v-for="group in filteredNavGroups" :key="group.label">
      <SidebarNavGroup :label="group.label" :collapsed="collapsed">
        <template v-for="item in group.items" :key="item.id">
          <!-- Item with children (collapsible) -->
          <SidebarNavItemCollapsible
            v-if="item.children && item.children.length > 0"
            :icon="item.icon"
            :label="item.label"
            :collapsed="collapsed"
            :child-routes="getChildRoutes(item)"
          >
            <!-- Collapsed: Show dropdown -->
            <template #collapsed>
              <SidebarNavDropdown
                :icon="item.icon"
                :label="item.label"
                :items="item.children"
                :child-routes="getChildRoutes(item)"
              />
            </template>

            <!-- Expanded: Show collapsible children -->
            <SidebarNavItem
              v-for="child in item.children"
              :key="child.id"
              :to="child.to"
              :label="child.label"
              :disabled="child.disabled"
              is-child
            >
              <!-- Badge from outside using slot -->
              <template v-if="child.badge" #right>
                <span
                  class="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white"
                >
                  {{ child.badge }}
                </span>
              </template>
            </SidebarNavItem>
          </SidebarNavItemCollapsible>

          <!-- Single item -->
          <SidebarNavItem
            v-else
            :to="item.to"
            :href="item.href"
            :icon="item.icon"
            :label="item.label"
            :collapsed="collapsed"
            :disabled="item.disabled"
          >
            <!-- Badge from outside using slot -->
            <template v-if="item.badge" #right>
              <span
                class="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white"
              >
                {{ item.badge }}
              </span>
            </template>
          </SidebarNavItem>
        </template>
      </SidebarNavGroup>
    </template>
  </div>
</template>
