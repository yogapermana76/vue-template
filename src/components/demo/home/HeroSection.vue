<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { ArrowRight, Github } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'

  interface Props {
    title?: string
    highlight?: string
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Build Modern Apps with',
    highlight: 'Vue 3 + Vite',
    description:
      'A production-ready template with Tailwind CSS, TypeScript, and shadcn-vue. Start building beautiful, responsive applications in minutes.',
  })
</script>

<template>
  <section class="relative overflow-hidden py-12">
    <!-- Background gradient -->
    <div
      class="from-primary-100 via-primary-50 to-background pointer-events-none absolute inset-0 bg-linear-to-b"
    />

    <div class="relative flex flex-col items-center space-y-8 px-4 text-center">
      <!-- Badge -->
      <Badge class="bg-primary-500 px-4 py-1.5 text-white">
        <span class="mr-2 inline-block size-2 animate-pulse rounded-full bg-white" />
        Open Source & Free
      </Badge>

      <!-- Title -->
      <h1 class="max-w-4xl text-3xl font-bold tracking-tight">
        {{ title }}
        <span
          class="from-primary-500 to-secondary-500 bg-linear-to-r bg-clip-text text-transparent"
        >
          {{ highlight }}
        </span>
      </h1>

      <!-- Description -->
      <p class="text-muted-foreground body-l max-w-2xl">
        {{ description }}
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col gap-3 pt-4">
        <Button variant="primary" size="lg" as-child class="min-w-40">
          <RouterLink to="/products">
            Get Started
            <ArrowRight class="ml-2 size-4" />
          </RouterLink>
        </Button>
        <Button variant="secondary" size="lg" as-child class="min-w-40">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github class="mr-2 size-4" />
            View on GitHub
          </a>
        </Button>
      </div>

      <!-- Stats preview -->
      <div
        class="text-muted-foreground body-m flex flex-wrap items-center justify-center gap-8 pt-8"
      >
        <div class="flex items-center gap-2">
          <span class="text-primary-600 heading-l">100+</span>
          Components
        </div>
        <div class="bg-primary-200 h-8 w-px" />
        <div class="flex items-center gap-2">
          <span class="text-primary-600 heading-l">50+</span>
          Examples
        </div>
        <div class="bg-primary-200 h-8 w-px" />
        <div class="flex items-center gap-2">
          <span class="text-primary-600 heading-l">10k+</span>
          Downloads
        </div>
      </div>
    </div>
  </section>
</template>
