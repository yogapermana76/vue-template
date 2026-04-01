<script setup lang="ts">
  import { ArrowLeft, Sun, Moon } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { useThemeStore } from '@/stores/theme'
  import { config } from '@/config'
  import { Button } from '@/components/ui/button'
  import { HeaderActionItem } from '@/components/layout'
  import type { HeaderProps } from '@/types/header'
  import { defaultHeaderProps } from '@/types/header'

  const props = withDefaults(defineProps<HeaderProps>(), {
    title: defaultHeaderProps.title,
    showBack: defaultHeaderProps.showBack,
    hideThemeToggle: defaultHeaderProps.hideThemeToggle,
    positioning: defaultHeaderProps.positioning,
    rightActions: () => defaultHeaderProps.rightActions || [],
  })

  const router = useRouter()
  const themeStore = useThemeStore()

  /** Use custom onBack if provided, otherwise default to router.back() */
  const handleBack = () => {
    if (props.onBack) {
      props.onBack()
    } else {
      router.back()
    }
  }
</script>

<template>
  <header
    :class="[
      'bg-background/95 supports-backdrop-filter:bg-background/60 top-0 z-50 w-full backdrop-blur',
      positioning === 'fixed' ? 'fixed' : positioning === 'sticky' ? 'sticky' : '',
      (positioning === 'fixed' || positioning === 'sticky') && 'right-0 left-0 mx-auto',
      $attrs.class,
    ]"
    :style="
      positioning === 'fixed' || positioning === 'sticky'
        ? { maxWidth: `${config.ui.maxWidth}px` }
        : undefined
    "
  >
    <div class="flex h-14 items-center gap-3 px-4">
      <!-- Back Button -->
      <Button v-if="showBack" variant="ghost" size="icon" class="-ml-2" @click="handleBack">
        <ArrowLeft class="size-5" />
      </Button>

      <!-- Title Section -->
      <div class="min-w-0 flex-1">
        <h1 v-if="title" class="text-primary-800 truncate text-lg font-semibold">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="truncate text-xs text-neutral-500">
          {{ subtitle }}
        </p>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-1">
        <HeaderActionItem v-for="action in rightActions" :key="action.id" :action="action" />

        <!-- Slot for custom components -->
        <slot name="actions" />

        <!-- Teleport target for page-level actions -->
        <div id="header-actions-teleport" />

        <!-- Theme Toggle -->
        <Button
          v-if="!hideThemeToggle"
          variant="ghost"
          size="icon"
          @click="themeStore.toggleDark()"
        >
          <Sun v-if="themeStore.isDark" class="size-5" />
          <Moon v-else class="size-5" />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  </header>
</template>
