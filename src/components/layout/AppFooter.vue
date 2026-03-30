<script setup lang="ts">
  import { config } from '@/config'
</script>

<template>
  <footer class="border-t py-6 md:py-0">
    <div
      class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-14 md:flex-row"
    >
      <p class="text-muted-foreground text-sm">
        &copy; {{ new Date().getFullYear() }} {{ config.app.name }}. All rights reserved.
      </p>
      <div class="text-muted-foreground flex items-center space-x-4 text-sm">
        <a href="#" class="hover:underline">Privacy</a>
        <a href="#" class="hover:underline">Terms</a>
      </div>
    </div>
  </footer>
</template>
