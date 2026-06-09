<script setup lang="ts">
  import { cn } from '@/utils/cn'
  import { Image } from '@/components/ui/image'
  import plnLogo from '@/assets/images/pln-mobile-logo.png'

  interface Props {
    /** Logo image URL */
    logo?: string
    /** Logo for collapsed state */
    logoCollapsed?: string
    /** App title */
    title?: string
    /** Whether sidebar is collapsed */
    collapsed?: boolean
  }

  withDefaults(defineProps<Props>(), {
    collapsed: false,
    logo: plnLogo,
    title: 'BOT Lifestyle',
  })
</script>

<template>
  <div
    :class="
      cn(
        'border-border flex h-16 shrink-0 items-center border-b px-4',
        collapsed && 'justify-center px-2',
      )
    "
  >
    <!-- Expanded: Logo + Title -->
    <div v-if="!collapsed" class="flex items-center gap-3 overflow-hidden">
      <Image
        v-if="logo"
        :src="logo"
        alt="Logo"
        class="size-12 shrink-0"
        container-class="size-12"
        object-fit="contain"
        :lazy="false"
        loading-strategy="none"
      />
      <span v-if="title" class="text-foreground truncate font-semibold">{{ title }}</span>
      <slot v-if="!logo && !title" />
    </div>

    <!-- Collapsed: Logo only -->
    <Image
      v-else-if="logoCollapsed || logo"
      :src="logoCollapsed || logo"
      alt="Logo"
      class="size-12"
      container-class="size-12"
      object-fit="contain"
      :lazy="false"
      loading-strategy="none"
    />

    <!-- Custom slot for collapsed -->
    <slot v-else-if="collapsed" name="collapsed" />
  </div>
</template>
