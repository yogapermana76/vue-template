<script setup lang="ts">
  import { ArrowLeft, Sun, Moon } from 'lucide-vue-next'
  import { useThemeStore } from '@/stores/theme'
  import { Button } from '@/components/ui/button'

  defineProps<{
    title: string
    showBack: boolean
  }>()

  const emit = defineEmits<{
    back: []
  }>()

  const themeStore = useThemeStore()
</script>

<template>
  <header
    class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
  >
    <div class="flex h-14 items-center gap-3 px-4">
      <Button v-if="showBack" variant="ghost" size="icon" class="-ml-2" @click="emit('back')">
        <ArrowLeft class="size-5" />
      </Button>

      <h1 class="flex-1 truncate text-lg font-semibold">
        {{ title }}
      </h1>

      <Button variant="ghost" size="icon" @click="themeStore.toggleDark()">
        <Sun v-if="themeStore.isDark" class="size-5" />
        <Moon v-else class="size-5" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </header>
</template>
