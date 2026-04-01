<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { ArrowRight, Sparkles } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Card, CardContent } from '@/components/ui/card'

  interface Props {
    title?: string
    description?: string
    primaryText?: string
    primaryTo?: string
    secondaryText?: string
    secondaryTo?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Ready to Get Started?',
    description:
      'Start building your next project with this template. It includes everything you need to create a modern web application.',
    primaryText: 'Start Building',
    primaryTo: '/products',
    secondaryText: 'Learn More',
    secondaryTo: '/docs',
  })
</script>

<template>
  <section class="px-4 py-12">
    <Card
      class="from-primary-50 via-primary-100 to-secondary-50 border-primary-200 overflow-hidden bg-linear-to-r"
    >
      <CardContent class="relative p-6">
        <!-- Background decoration -->
        <div class="bg-primary-200/50 absolute -top-20 -right-20 size-64 rounded-full blur-3xl" />
        <div
          class="bg-secondary-200/50 absolute -bottom-20 -left-20 size-64 rounded-full blur-3xl"
        />

        <div class="relative flex flex-col items-center text-center">
          <div class="bg-primary-500 mb-6 flex size-16 items-center justify-center rounded-full">
            <Sparkles class="size-8 text-white" />
          </div>

          <h2 class="mb-4 text-2xl font-bold tracking-tight text-neutral-900">
            {{ title }}
          </h2>

          <p class="mb-8 max-w-2xl text-lg text-neutral-600">
            {{ description }}
          </p>

          <div class="flex flex-col gap-3">
            <Button
              as-child
              size="lg"
              class="bg-primary-500 hover:bg-primary-600 min-w-40 text-white"
            >
              <RouterLink :to="primaryTo">
                {{ primaryText }}
                <ArrowRight class="ml-2 size-4" />
              </RouterLink>
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="border-secondary-400 text-secondary-600 hover:bg-secondary-50 min-w-40"
              as-child
            >
              <RouterLink :to="secondaryTo">
                {{ secondaryText }}
              </RouterLink>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
