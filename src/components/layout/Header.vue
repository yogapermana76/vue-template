<script setup lang="ts">
  import { computed } from 'vue'
  import { ArrowLeft, Sun, Moon } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import { useThemeStore } from '@/stores/theme'
  import { useWindowScroll } from '@/composables'
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
    transparent: false,
    scrollThreshold: 50,
  })

  const router = useRouter()
  const themeStore = useThemeStore()
  const { isScrolled } = useWindowScroll({
    threshold: () => props.scrollThreshold,
  })

  /** Use custom onBack if provided, otherwise default to router.back() */
  const handleBack = () => {
    if (props.onBack) {
      props.onBack()
    } else {
      router.back()
    }
  }

  // Positioning class map
  const POSITIONING_CLASSES: Record<string, string> = {
    fixed: 'fixed',
    sticky: 'sticky',
    static: '',
  }

  /** Whether header uses fixed/sticky positioning */
  const isFixedOrSticky = computed(() => {
    return props.positioning === 'fixed' || props.positioning === 'sticky'
  })

  /** Positioning class based on prop */
  const positioningClass = computed(() => {
    return POSITIONING_CLASSES[props.positioning] || ''
  })

  /** Background class for transparent mode */
  const backgroundClass = computed(() => {
    if (!props.transparent) return ''
    return isScrolled.value ? 'bg-white!' : 'bg-transparent!'
  })

  /** Combined header classes */
  const headerClass = computed(() => [
    'top-0 z-50 w-full bg-white',
    positioningClass.value,
    isFixedOrSticky.value && 'right-0 left-0 mx-auto',
    props.transparent && 'transition-all duration-300',
    backgroundClass.value,
  ])

  /** Header max-width style for fixed/sticky positioning */
  const headerStyle = computed(() => {
    if (!isFixedOrSticky.value) return undefined
    return { maxWidth: `${config.ui.maxWidth}px` }
  })

  /** Title text color class */
  const titleClass = computed(() => {
    if (!props.transparent) return 'text-neutral-950'
    return isScrolled.value ? 'text-neutral-950' : 'text-white!'
  })

  /** Whether icons should use dark background styling (for transparent header before scroll) */
  const isDarkBg = computed(() => {
    return props.transparent && !isScrolled.value
  })

  /** Button icon color class */
  const iconColorClass = computed(() => {
    return !isDarkBg.value ? 'text-neutral-950' : ''
  })
</script>

<template>
  <header :class="[headerClass, $attrs.class]" :style="headerStyle">
    <div class="flex h-full items-center gap-2 px-4">
      <!-- Left: Back Button -->
      <IconButton
        v-if="showBack"
        variant="tertiary"
        size="md"
        :is-dark-bg="isDarkBg"
        :class="['-ml-2', iconColorClass]"
        @click="handleBack"
      >
        <ArrowLeft />
      </IconButton>

      <!-- Center: Custom slot or default title section -->
      <slot name="center">
        <div class="min-w-0 flex-1">
          <h1 v-if="title" class="heading-s truncate" :class="titleClass">
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
        <slot name="actions" :is-dark-bg="isDarkBg" :icon-class="iconColorClass" />

        <!-- Theme Toggle -->
        <IconButton
          v-if="!hideThemeToggle"
          variant="tertiary"
          size="md"
          :is-dark-bg="isDarkBg"
          :class="iconColorClass"
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
