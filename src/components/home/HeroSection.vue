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
  <section class="relative overflow-hidden py-16 md:py-24 lg:py-32">
    <!-- Background gradient -->
    <div
      class="from-primary/5 via-primary/10 to-background pointer-events-none absolute inset-0 bg-linear-to-b"
    />

    <div class="relative flex flex-col items-center space-y-8 px-4 text-center">
      <!-- Badge -->
      <Badge variant="secondary" class="px-4 py-1.5">
        <span class="mr-2 inline-block size-2 animate-pulse rounded-full bg-green-500" />
        Open Source & Free
      </Badge>

      <!-- Title -->
      <h1 class="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        {{ title }}
        <span class="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
          {{ highlight }}
        </span>
      </h1>

      <!-- Description -->
      <p class="text-muted-foreground max-w-2xl text-lg md:text-xl">
        {{ description }}
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col gap-4 pt-4 sm:flex-row">
        <Button as-child size="lg" class="min-w-40">
          <RouterLink to="/products">
            Get Started
            <ArrowRight class="ml-2 size-4" />
          </RouterLink>
        </Button>
        <Button variant="outline" size="lg" class="min-w-40" as-child>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github class="mr-2 size-4" />
            View on GitHub
          </a>
        </Button>
      </div>

      <!-- Stats preview -->
      <div
        class="text-muted-foreground flex flex-wrap items-center justify-center gap-8 pt-8 text-sm"
      >
        <div class="flex items-center gap-2">
          <span class="text-foreground text-2xl font-bold">100+</span>
          Components
        </div>
        <div class="bg-border hidden h-8 w-px sm:block" />
        <div class="flex items-center gap-2">
          <span class="text-foreground text-2xl font-bold">50+</span>
          Examples
        </div>
        <div class="bg-border hidden h-8 w-px sm:block" />
        <div class="flex items-center gap-2">
          <span class="text-foreground text-2xl font-bold">10k+</span>
          Downloads
        </div>
      </div>
    </div>
  </section>
</template>
