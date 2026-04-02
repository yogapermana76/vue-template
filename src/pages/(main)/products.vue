<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Filter, Loader2 } from 'lucide-vue-next'
  import { useProductsInfinite, useProductCategories } from '@/composables/services/useProducts'
  import { usePullToRefresh } from '@/composables/ui'
  import { Button } from '@/components/ui/button'
  import { Header } from '@/components/layout'
  import { EmptyState, ErrorState, PullToRefresh } from '@/components/shared'
  import {
    ProductCard,
    ProductCardSkeleton,
    ProductGrid,
    ProductFilters,
  } from '@/components/products'
  import type { ProductFilters as ProductFiltersType } from '@/services/product'

  definePage({
    meta: {
      title: 'Products',
    },
  })

  const ITEMS_PER_PAGE = 10

  const filters = ref<ProductFiltersType>({
    search: '',
    category: '',
    sort: 'asc',
  })

  const loadMoreRef = ref<HTMLElement | null>(null)

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useProductsInfinite(filters, ITEMS_PER_PAGE)

  const { data: categories } = useProductCategories()

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
    },
  })

  // Flatten all pages into single products array
  const products = computed(() => {
    if (!data.value?.pages) return []
    return data.value.pages.flatMap(page => page.products)
  })

  const total = computed(() => data.value?.pages?.[0]?.total ?? 0)

  // Intersection observer for infinite scroll
  useIntersectionObserver(
    loadMoreRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    },
    { threshold: 0.1 },
  )

  const handleReset = () => {
    filters.value = { search: '', category: '', sort: 'asc' }
  }
</script>

<template>
  <!-- Header (outside padded container for proper sticky positioning) -->
  <Header
    title="Products"
    :subtitle="`Browse our collection of ${total} products`"
    :show-back="false"
    positioning="normal"
    :hide-theme-toggle="true"
  />

  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <!-- Content (with padding) -->
  <div class="space-y-4 px-4">
    <!-- Filters -->
    <ProductFilters
      v-model:search="filters.search"
      v-model:category="filters.category"
      v-model:sort="filters.sort"
      :categories="categories ?? []"
    />

    <!-- Loading State (initial) -->
    <ProductGrid v-if="isLoading">
      <ProductCardSkeleton v-for="i in 6" :key="i" />
    </ProductGrid>

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      title="Error loading products"
      :message="error.message"
      @retry="refetch"
    />

    <!-- Products Grid with Infinite Scroll -->
    <template v-else-if="products.length">
      <ProductGrid>
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </ProductGrid>

      <!-- Load More Trigger -->
      <div ref="loadMoreRef" class="flex justify-center py-4">
        <div v-if="isFetchingNextPage" class="flex items-center gap-2">
          <Loader2 class="text-primary-500 size-5 animate-spin" />
          <span class="text-sm text-neutral-500">Loading more...</span>
        </div>
        <p v-else-if="!hasNextPage" class="text-sm text-neutral-500">You've reached the end</p>
      </div>
    </template>

    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="Filter"
      title="No products found"
      description="Try adjusting your search or filter criteria"
    >
      <template #action>
        <Button
          variant="secondary"
          class="border-primary-300 text-primary-600 hover:bg-primary-50"
          @click="handleReset"
          >Clear Filters</Button
        >
      </template>
    </EmptyState>
  </div>
</template>
