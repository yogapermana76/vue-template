<script setup lang="ts">
  import { ref } from 'vue'
  import { Heart, Share2 } from 'lucide-vue-next'
  import { Header } from '@/components/layout'
  import { Card } from '@/components/ui/card'
  import { IconButton } from '@/components/ui/button'

  definePage({
    meta: {
      title: 'Scrollable Page Example',
    },
  })

  // Sample data for scrollable content
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is a sample item to demonstrate scrollable content with fixed header. Item #${i + 1}`,
  }))

  // Example header actions
  const isFavorited = ref(false)
  const handleShare = () => console.log('Share clicked')
  const toggleFavorite = () => {
    isFavorited.value = !isFavorited.value
  }
</script>

<template>
  <div class="min-h-screen">
    <!-- Fixed Header -->
    <Header title="Scrollable Page" positioning="fixed">
      <template #actions>
        <IconButton variant="tertiary" size="md" title="Share" @click="handleShare">
          <Share2 class="h-5 w-5" />
        </IconButton>
        <IconButton
          variant="tertiary"
          size="md"
          :title="isFavorited ? 'Added' : 'Add to favorites'"
          @click="toggleFavorite"
        >
          <Heart class="h-5 w-5" :fill="isFavorited ? 'currentColor' : 'none'" />
        </IconButton>
      </template>
    </Header>

    <!-- Scrollable Content Container with Gradient Background -->
    <div class="from-primary-50 via-secondary-50 to-background flex-1 bg-linear-to-b pt-14">
      <!-- Initial Content (Visible Behind fixed Header) -->
      <div class="relative p-6">
        <div class="bg-background/80 rounded-lg p-4 shadow-sm backdrop-blur">
          <h2 class="heading-m mb-2">Welcome</h2>
          <p class="body-small text-neutral-600">
            This page demonstrates a fixed header that starts transparent and blends with the
            gradient background. Scroll down to see it become opaque with a solid background.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-3 p-4">
        <!-- Items List -->
        <div v-for="item in items" :key="item.id">
          <Card class="bg-background/80 border border-neutral-200 p-4 backdrop-blur">
            <h3 class="heading-s mb-1">{{ item.title }}</h3>
            <p class="body-caption text-neutral-500">{{ item.description }}</p>
          </Card>
        </div>

        <!-- Footer spacing for fixed footer (if needed) -->
        <div class="h-4" />
      </div>
    </div>
  </div>
</template>
