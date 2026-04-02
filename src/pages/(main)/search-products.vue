<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useIntersectionObserver } from '@vueuse/core'
  import { Filter, Loader2, ArrowUpDown } from 'lucide-vue-next'
  import { useProductsInfinite, useProductCategories } from '@/composables/services/useProducts'
  import { usePullToRefresh } from '@/composables/ui'
  import { Button, IconButton } from '@/components/ui/button'
  import { Header } from '@/components/layout'
  import { SearchInput } from '@/components/shared'
  import { EmptyState, ErrorState, PullToRefresh } from '@/components/shared'
  import { ProductCard, ProductCardSkeleton, ProductGrid } from '@/components/products'
  import { CategoryFilterBottomSheet, SortFilterBottomSheet } from '@/components/products/filters'
  import type { ProductFilters as ProductFiltersType } from '@/services/product'

  definePage({
    meta: {
      title: 'Search Products',
    },
  })

  const router = useRouter()
  const ITEMS_PER_PAGE = 10

  const filters = ref<ProductFiltersType>({
    search: '',
    category: '',
    sort: 'asc',
  })

  const loadMoreRef = ref<HTMLElement | null>(null)
  const categorySheetOpen = ref(false)
  const sortSheetOpen = ref(false)

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

  // Focus on search input when page mounts
  const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null)

  onMounted(() => {
    searchInputRef.value?.$el?.querySelector('input')?.focus()
  })

  const handleBack = () => {
    router.back()
  }

  const handleReset = () => {
    filters.value = { search: '', category: '', sort: 'asc' }
  }
</script>

<template>
  <!-- Header with Search Bar in Center -->
  <Header :show-back="true" :hide-theme-toggle="true" :on-back="handleBack">
    <template #center>
      <div class="min-w-0 flex-1">
        <SearchInput
          ref="searchInputRef"
          v-model="filters.search"
          placeholder="Search products..."
          class="w-full"
        />
      </div>
    </template>

    <template #actions>
      <!-- Filter Button -->
      <IconButton variant="tertiary" size="md" title="Filter" @click="categorySheetOpen = true">
        <Filter />
      </IconButton>

      <!-- Sort Button -->
      <IconButton variant="tertiary" size="md" title="Sort" @click="sortSheetOpen = true">
        <ArrowUpDown />
      </IconButton>
    </template>
  </Header>

  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <!-- Content -->
  <div class="space-y-4 px-4">
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
          <span class="body-m text-neutral-500">Loading more...</span>
        </div>
        <p v-else-if="!hasNextPage" class="body-m text-neutral-500">You've reached the end</p>
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
        >
          Clear Filters
        </Button>
      </template>
    </EmptyState>
  </div>

  <!-- Category Filter Sheet -->
  <CategoryFilterBottomSheet
    v-model:open="categorySheetOpen"
    v-model:category="filters.category"
    :categories="categories ?? []"
  />

  <!-- Sort Filter Sheet -->
  <SortFilterBottomSheet v-model:open="sortSheetOpen" v-model:sort="filters.sort" />
</template>
