<script setup lang="ts">
  defineProps<{
    title: string
    subtitle: string
  }>()
</script>

<template>
  <!-- `<div>` (not `<header>`) on purpose: main.css applies a global
       `header { @apply h-12 }` rule (for the app's top-bar layout), which
       clamps every `<header>` in the tree to 48px and causes tall page
       titles like this one to overflow into the next section. Using a
       plain block sidesteps that rule. -->
  <div>
    <h2
      class="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-[2.5rem] sm:leading-[1.1]"
    >
      {{ title }}
    </h2>
    <p class="body-l mt-3 text-slate-500">{{ subtitle }}</p>
  </div>
</template>
