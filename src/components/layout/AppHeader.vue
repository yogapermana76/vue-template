<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { Sun, Moon, Menu, X } from 'lucide-vue-next'
  import { useThemeStore } from '@/stores/theme'
  import { Button } from '@/components/ui/button'
  import { config } from '@/config'

  interface NavItem {
    name: string
    to: string
  }

  defineProps<{
    navigation: NavItem[]
    isMobileMenuOpen: boolean
  }>()

  const emit = defineEmits<{
    toggleMenu: []
  }>()

  const themeStore = useThemeStore()
</script>

<template>
  <header
    class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
  >
    <div class="container mx-auto flex h-14 items-center px-4">
      <RouterLink to="/" class="mr-6 flex items-center space-x-2">
        <span class="text-xl font-bold">{{ config.app.name }}</span>
      </RouterLink>

      <nav class="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="hover:text-foreground/80 text-foreground/60 transition-colors"
          active-class="text-foreground"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="flex items-center space-x-2">
        <Button variant="ghost" size="icon" @click="themeStore.toggleDark()">
          <Sun v-if="themeStore.isDark" class="size-5" />
          <Moon v-else class="size-5" />
          <span class="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon" class="md:hidden" @click="emit('toggleMenu')">
          <X v-if="isMobileMenuOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </Button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="border-t md:hidden">
      <nav class="container mx-auto space-y-2 px-4 py-4">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="hover:text-foreground/80 text-foreground/60 block py-2 text-sm font-medium transition-colors"
          active-class="text-foreground"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
