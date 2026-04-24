<script setup lang="ts">
  import { RouterView } from 'vue-router'

  interface Props {
    transitionName?: string
    transitionMode?: 'out-in' | 'in-out' | 'default'
    keepAliveMax?: number
  }

  withDefaults(defineProps<Props>(), {
    transitionName: 'page',
    transitionMode: 'out-in',
    keepAliveMax: 5,
  })
</script>

<template>
  <RouterView v-slot="{ Component, route: currentRoute }">
    <Transition :name="transitionName" :mode="transitionMode">
      <KeepAlive v-if="currentRoute.meta.keepAlive" :max="keepAliveMax">
        <component :is="Component" :key="currentRoute.path" />
      </KeepAlive>
      <component v-else :is="Component" :key="currentRoute.path" />
    </Transition>
  </RouterView>
</template>

<style>
  /* Page transition animations */
  .page-enter-active {
    transition: opacity 0.15s ease-out;
  }

  .page-leave-active {
    transition: opacity 0.1s ease-in;
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 0;
  }
</style>
