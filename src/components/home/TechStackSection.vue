<script setup lang="ts">
  interface TechItem {
    name: string
    category: 'core' | 'ui' | 'tools'
  }

  interface Props {
    title?: string
    subtitle?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Modern Tech Stack',
    subtitle: 'Carefully selected technologies that work great together.',
  })

  const techStack: TechItem[] = [
    { name: 'Vue 3', category: 'core' },
    { name: 'Vite', category: 'core' },
    { name: 'TypeScript', category: 'core' },
    { name: 'Vue Router', category: 'core' },
    { name: 'Pinia', category: 'core' },
    { name: 'TanStack Query', category: 'core' },
    { name: 'Tailwind CSS', category: 'ui' },
    { name: 'shadcn-vue', category: 'ui' },
    { name: 'Reka UI', category: 'ui' },
    { name: 'Lucide Icons', category: 'ui' },
    { name: 'VueUse', category: 'tools' },
    { name: 'Zod', category: 'tools' },
    { name: 'Axios', category: 'tools' },
    { name: 'date-fns', category: 'tools' },
    { name: 'ESLint', category: 'tools' },
    { name: 'Prettier', category: 'tools' },
  ]

  const categoryColors = {
    core: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    ui: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    tools: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  }
</script>

<template>
  <section class="bg-muted/30 px-4 py-12">
    <div class="mb-8 text-center">
      <h2 class="mb-4 text-2xl font-bold tracking-tight">
        {{ title }}
      </h2>
      <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
        {{ subtitle }}
      </p>
    </div>

    <!-- Category legend -->
    <div class="mb-8 flex flex-wrap items-center justify-center gap-4">
      <div class="flex items-center gap-2">
        <span class="size-3 rounded-full bg-blue-500" />
        <span class="text-muted-foreground text-sm">Core</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="size-3 rounded-full bg-purple-500" />
        <span class="text-muted-foreground text-sm">UI</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="size-3 rounded-full bg-green-500" />
        <span class="text-muted-foreground text-sm">Tools</span>
      </div>
    </div>

    <!-- Tech badges -->
    <div class="flex flex-wrap justify-center gap-2">
      <span
        v-for="tech in techStack"
        :key="tech.name"
        :class="[
          'rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 hover:scale-105',
          categoryColors[tech.category],
        ]"
      >
        {{ tech.name }}
      </span>
    </div>
  </section>
</template>
