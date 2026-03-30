<script setup lang="ts">
  import type { Component } from 'vue'
  import { Zap, Shield, Smartphone, Palette, Code2, Layers } from 'lucide-vue-next'
  import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

  interface Feature {
    icon: Component
    title: string
    description: string
  }

  interface Props {
    title?: string
    subtitle?: string
    features?: Feature[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Everything You Need',
    subtitle:
      'Built with modern technologies and best practices for production-ready applications.',
    features: () => [
      {
        icon: Zap,
        title: 'Lightning Fast',
        description:
          'Powered by Vite for instant HMR and optimized production builds with tree-shaking.',
      },
      {
        icon: Shield,
        title: 'Type Safe',
        description:
          'Full TypeScript support with strict type checking, auto-completion, and better DX.',
      },
      {
        icon: Smartphone,
        title: 'Responsive Design',
        description: 'Mobile-first approach with adaptive layouts that work on any screen size.',
      },
      {
        icon: Palette,
        title: 'Beautiful UI',
        description:
          'Pre-built shadcn-vue components with dark mode support and customizable themes.',
      },
      {
        icon: Code2,
        title: 'Developer Experience',
        description: 'ESLint, Prettier, and Husky pre-configured for consistent, quality code.',
      },
      {
        icon: Layers,
        title: 'Scalable Architecture',
        description: 'Modular structure with composables, stores, and services ready to scale.',
      },
    ],
  })
</script>

<template>
  <section class="py-16 md:py-24">
    <!-- Section header -->
    <div class="mb-12 px-4 text-center md:mb-16">
      <h2 class="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        {{ title }}
      </h2>
      <p class="text-muted-foreground mx-auto max-w-2xl text-lg">
        {{ subtitle }}
      </p>
    </div>

    <!-- Horizontal scroll -->
    <div class="scrollbar-none flex flex-nowrap gap-4 overflow-x-auto pb-4">
      <!-- Left spacer -->
      <div class="w-4 shrink-0" />

      <Card
        v-for="feature in features"
        :key="feature.title"
        class="group w-64 min-w-64 shrink-0 transition-all duration-300"
      >
        <CardHeader class="p-4">
          <div class="bg-primary/10 mb-3 flex size-10 items-center justify-center rounded-lg">
            <component :is="feature.icon" class="text-primary size-5" />
          </div>
          <CardTitle class="text-base">{{ feature.title }}</CardTitle>
          <CardDescription class="text-sm">
            {{ feature.description }}
          </CardDescription>
        </CardHeader>
      </Card>

      <!-- Right spacer -->
      <div class="w-4 shrink-0" />
    </div>
  </section>
</template>
