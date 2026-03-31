<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useProduct } from '@/composables/services/useProducts'
  import { usePullToRefresh } from '@/composables/ui'
  import { Skeleton } from '@/components/ui/skeleton'
  import { ErrorState, PullToRefresh } from '@/components/shared'
  import {
    ProductImage,
    ProductInfo,
    ProductDescription,
    ProductActions,
  } from '@/components/products'

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
      <!-- Product Image Section -->
      <ProductImage :product="product" />

      <!-- Product Details -->
      <div class="flex flex-1 flex-col p-4">
        <!-- Product Info (Category, Title, Rating, Price) -->
        <ProductInfo :product="product" />

        <!-- Divider -->
        <div class="my-3 border-t" />

        <!-- Product Description -->
        <ProductDescription :product="product" />
      </div>

      <!-- Product Actions (Buy / Add to Cart) -->
      <ProductActions />
    </template>
  </div>
</template>
