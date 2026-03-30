<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { Star, ShoppingCart, Share2 } from 'lucide-vue-next'
  import { useProduct } from '@/composables/services/useProducts'
  import { usePullToRefresh } from '@/composables/usePullToRefresh'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Skeleton } from '@/components/ui/skeleton'
  import { ErrorState, PullToRefresh } from '@/components/shared'
  import { formatCurrency } from '@/utils/currency'

  definePage({
    meta: {
      title: 'Product Detail',
    },
  })

  const route = useRoute('/(default)/products/[id]')
  const productId = computed(() => Number(route.params.id))

  const { data: product, isLoading, error, refetch } = useProduct(productId)

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
    },
  })
</script>

<template>
  <div class="flex min-h-full flex-col">
    <!-- Pull to Refresh Indicator -->
    <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

    <!-- Loading State -->
    <template v-if="isLoading">
      <Skeleton class="aspect-square w-full" />
      <div class="space-y-3 p-4">
        <Skeleton class="h-5 w-20" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-20 w-full" />
      </div>
    </template>

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      title="Error loading product"
      :message="error.message"
      @retry="refetch"
    />

    <!-- Product Detail -->
    <template v-else-if="product">
      <!-- Image -->
      <div class="bg-muted relative aspect-square w-full overflow-hidden">
        <img :src="product.image" :alt="product.title" class="size-full object-cover" />
        <!-- Share button -->
        <Button variant="secondary" size="icon" class="absolute top-3 right-3 size-9 rounded-full">
          <Share2 class="size-4" />
        </Button>
      </div>

      <!-- Details -->
      <div class="flex flex-1 flex-col p-4">
        <Badge variant="secondary" class="mb-2 w-fit text-xs">
          {{ product.category }}
        </Badge>

        <h1 class="mb-2 text-lg leading-tight font-bold">
          {{ product.title }}
        </h1>

        <!-- Rating -->
        <div class="mb-3 flex items-center gap-2">
          <div class="flex items-center">
            <Star class="size-4 fill-yellow-400 text-yellow-400" />
            <span class="ml-1 text-sm font-medium">
              {{ product.rating.rate.toFixed(1) }}
            </span>
          </div>
          <span class="text-muted-foreground text-xs"> ({{ product.rating.count }} reviews) </span>
        </div>

        <!-- Price -->
        <div class="mb-3 text-2xl font-bold">
          {{ formatCurrency(product.price, 'USD') }}
        </div>

        <!-- Description -->
        <p class="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <!-- Fixed Bottom Actions -->
      <div class="bg-background sticky bottom-0 border-t p-4">
        <div class="flex gap-3">
          <Button variant="outline" size="lg" class="flex-1"> Buy Now </Button>
          <Button size="lg" class="flex-1">
            <ShoppingCart class="mr-2 size-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>
