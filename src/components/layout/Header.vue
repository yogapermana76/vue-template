<script setup lang="ts">
  import { ArrowLeft, Sun, Moon } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { useThemeStore } from '@/stores/theme'
  import { config } from '@/config'
  import { IconButton } from '@/components/ui/button'
  import { HeaderActionItem } from '@/components/layout'
  import type { HeaderProps } from '@/types/header'
  import { defaultHeaderProps } from '@/types/header'

  const props = withDefaults(defineProps<HeaderProps>(), {
    title: defaultHeaderProps.title,
    showBack: defaultHeaderProps.showBack,
    hideThemeToggle: defaultHeaderProps.hideThemeToggle,
    positioning: defaultHeaderProps.positioning,
    backButtonClass: 'text-neutral-950',
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
      'top-0 z-50 w-full bg-white',
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
    <div class="flex h-full items-center gap-2 px-4">
      <!-- Left: Back Button -->
      <IconButton
        v-if="showBack"
        variant="tertiary"
        size="md"
        :class="['-ml-2', backButtonClass]"
        @click="handleBack"
      >
        <ArrowLeft />
      </IconButton>

      <!-- Center: Custom slot or default title section -->
      <slot name="center">
        <div class="min-w-0 flex-1">
          <h1 v-if="title" class="heading-s truncate text-neutral-950">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="body-caption truncate text-neutral-500">
            {{ subtitle }}
          </p>
        </div>
      </slot>

      <!-- Right: Action buttons -->
      <div class="flex items-center">
        <HeaderActionItem v-for="action in rightActions" :key="action.id" :action="action" />

        <!-- Slot for custom components -->
        <slot name="actions" />

        <!-- Theme Toggle -->
        <IconButton
          v-if="!hideThemeToggle"
          variant="tertiary"
          size="md"
          class="text-neutral-950"
          title="Toggle theme"
          @click="themeStore.toggleDark()"
        >
          <Sun v-if="themeStore.isDark" />
          <Moon v-else />
        </IconButton>
      </div>
    </div>
  </header>
</template>
