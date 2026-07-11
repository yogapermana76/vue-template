<script setup lang="ts">
  import { computed, inject, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { X } from 'lucide-vue-next'
  import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer'
  import { TooltipProvider } from '@/components/ui/tooltip'
  import { Image } from '@/components/ui/image'
  import { config } from '@/config'
  import { layoutKey } from './types'
  import SidebarToggle from './SidebarToggle.vue'
  import { cn } from '@/utils/cn'
  import lightningGlow from '@/assets/vectors/lightning-glow-md.png'

  export interface SidebarProps {
    /** Logo image URL */
    logo?: string
    /** Logo for collapsed state */
    logoCollapsed?: string
    /** App title */
    title?: string
    /** Hide collapse toggle */
    hideToggle?: boolean
    /** Sidebar width in px */
    width?: number
    /** Collapsed sidebar width in px */
    collapsedWidth?: number
  }

  const props = withDefaults(defineProps<SidebarProps>(), {
    hideToggle: false,
    width: config.dashboard.sidebar.width,
    collapsedWidth: config.dashboard.sidebar.collapsedWidth,
  })

  const layout = inject(layoutKey)

  if (!layout) {
    throw new Error('[DashboardSidebar] Must be used inside DashboardLayout')
  }

  // Computed states
  const isCollapsed = computed(() => {
    if (!layout) return false
    if (layout.isMobile.value) return false
    return layout.isCollapsed.value
  })

  const isMobile = computed(() => layout?.isMobile.value ?? false)
  const isMobileOpen = computed(() => layout?.isMobileOpen.value ?? false)

  // Desktop sidebar style
  const sidebarStyle = computed(() => ({
    width: isCollapsed.value ? `${props.collapsedWidth}px` : `${props.width}px`,
  }))

  // Handlers
  const handleMobileOpenChange = (open: boolean) => {
    if (!open) {
      layout?.closeMobile()
    }
  }

  const handleToggle = () => {
    layout?.toggleCollapsed()
  }

  /**
   * Auto-close the mobile drawer whenever the route changes.
   *
   * Tapping a nav item on mobile pushes the route and Vue Router transitions
   * to the new page, but reka-ui's Drawer doesn't know the navigation
   * happened — the overlay stays open, covering the fresh page. Closing it
   * here (only while on mobile + when the drawer is actually open) keeps
   * behaviour consistent with what the operator expects from a native
   * drawer / bottom sheet. Watching `route.fullPath` fires on both path
   * *and* query changes, so switching between programs on the same page
   * still keeps the drawer closed if the user reopened it.
   */
  const route = useRoute()
  watch(
    () => route.fullPath,
    () => {
      if (isMobile.value && isMobileOpen.value) {
        layout?.closeMobile()
      }
    },
  )
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <!-- Mobile: Drawer with gradient -->
    <Drawer
      v-if="isMobile"
      :open="isMobileOpen"
      direction="left"
      :should-scale-background="false"
      @update:open="handleMobileOpenChange"
    >
      <DrawerContent
        :show-drag-handle="false"
        :style="{ width: `${width}px`, maxWidth: `${width}px` }"
        class="h-full border-none"
      >
        <div class="flex h-full flex-col bg-linear-to-b from-[#0a4f7a] via-[#0a7fa5] to-[#0ab5a0]">
          <!-- Mobile Header -->
          <div
            class="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4"
          >
            <div class="flex items-center gap-3">
              <Image
                v-if="logo"
                :src="logo"
                alt="Logo"
                class="size-12"
                container-class="size-12 bg-transparent"
                object-fit="contain"
                :lazy="false"
                loading-strategy="none"
              />
              <span v-if="title" class="font-semibold text-white">{{ title }}</span>
            </div>
            <DrawerClose as-child>
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X class="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>

          <!-- Navigation -->
          <nav class="scrollbar-none flex-1 overflow-y-auto p-4">
            <slot :collapsed="false" :is-mobile="true" />
          </nav>

          <!-- Footer: only render container if consumer provided a #footer slot -->
          <div v-if="$slots.footer" class="shrink-0 border-t border-white/10 p-4">
            <slot name="footer" :collapsed="false" :is-mobile="true" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>

    <!-- Desktop: Fixed Sidebar with gradient.
         `overflow-hidden` on the aside so the decorative lightning glow
         (positioned top-right and extending beyond the sidebar edge) is
         clipped cleanly instead of leaking into the page content. -->
    <aside
      v-else
      class="fixed inset-y-0 left-0 z-30 flex flex-col overflow-hidden bg-linear-to-b from-[#0a4f7a] via-[#0a7fa5] to-[#0ab5a0] transition-all duration-300 ease-in-out"
      :style="sidebarStyle"
    >
      <!-- Decorative glow — sits behind all content, ~70% visible with the
           top-right corner intentionally bleeding off-canvas. `select-none`
           + `pointer-events-none` so it never intercepts clicks. Hidden
           when the sidebar is collapsed (narrow rail has no room for it).
           Offsets scale with size (~33% overflow on top+right) so a larger
           image doesn't force the visible portion further down the sidebar. -->
      <img
        v-if="!isCollapsed"
        :src="lightningGlow"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -top-50 -right-14 z-0 h-120 w-xl opacity-25 select-none"
      />

      <!-- Header -->
      <div
        :class="
          cn(
            'flex h-16 shrink-0 items-center border-b border-white/10 px-4',
            isCollapsed ? 'justify-center px-2' : '',
          )
        "
      >
        <div v-if="!isCollapsed" class="flex items-center gap-3 overflow-hidden">
          <Image
            v-if="logo"
            :src="logo"
            alt="Logo"
            class="size-12 shrink-0"
            container-class="size-12 bg-transparent"
            object-fit="contain"
            :lazy="false"
            loading-strategy="none"
          />
          <span v-if="title" class="truncate font-semibold text-white">{{ title }}</span>
        </div>
        <Image
          v-else-if="logoCollapsed || logo"
          :src="(logoCollapsed || logo)!"
          alt="Logo"
          class="size-12"
          container-class="size-12 bg-transparent"
          object-fit="contain"
          :lazy="false"
          loading-strategy="none"
        />
      </div>

      <!-- Navigation -->
      <nav :class="cn('scrollbar-none flex-1 overflow-y-auto p-4', isCollapsed && 'px-2')">
        <slot :collapsed="isCollapsed" :is-mobile="false" />
      </nav>

      <!-- Footer: container always renders because it hosts the SidebarToggle.
           When no #footer slot is provided, we skip the top-margin on the
           toggle so it sits flush inside the padded footer. -->
      <div :class="cn('shrink-0 border-t border-white/10 p-4', isCollapsed && 'px-2')">
        <slot name="footer" :collapsed="isCollapsed" :is-mobile="false" />
        <SidebarToggle
          v-if="!hideToggle"
          :collapsed="isCollapsed"
          :class="$slots.footer ? 'mt-2' : ''"
          @toggle="handleToggle"
        />
      </div>
    </aside>
  </TooltipProvider>
</template>
