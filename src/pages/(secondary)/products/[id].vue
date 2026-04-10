<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Share2, Heart } from 'lucide-vue-next'
  import { useProduct } from '@/composables/services/useProducts'
  import { usePullToRefresh, useToast } from '@/composables/ui'
  import { useCartStore } from '@/stores/cart'
  import { Header, CartActionItem } from '@/components/layout'
  import { IconButton, Button } from '@/components/ui/button'
  import { Skeleton } from '@/components/ui/skeleton'
  import { PullToRefresh } from '@/components/shared'
  import { EmptyState } from '@/components/ui/empty-state'
  import { AlertCircle } from 'lucide-vue-next'
  import {
    ProductImage,
    ProductInfo,
    ProductDescription,
    ProductActions,
  } from '@/components/products'

  const router = useRouter()

  const route = useRoute('/(secondary)/products/[id]')
  const cartStore = useCartStore()
  const { success, error: toastError } = useToast()

  const productId = computed(() => Number(route.params.id))
  const quantity = ref(1)
  const isFavorited = ref(false)

  const { data: product, isLoading, error, refetch } = useProduct(productId)

  const handleShare = async () => {
    if (!product.value) return

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.value.title,
          text: product.value.description,
          url: window.location.href,
        })
      } catch {
        // User cancelled the share dialog
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        success({
          title: 'Link copied!',
          description: 'Product link copied to clipboard',
        })
      } catch {
        toastError({
          title: 'Error',
          description: 'Failed to copy link',
        })
      }
    }
  }

  const toggleFavorite = () => {
    isFavorited.value = !isFavorited.value
    success({
      title: isFavorited.value ? 'Added to favorites!' : 'Removed from favorites',
      description: isFavorited.value
        ? `${product.value?.title} added to your favorites`
        : `${product.value?.title} removed from your favorites`,
    })
  }

  definePage({
    meta: {
      title: 'Product Detail',
    },
  })

  const addToCart = () => {
    if (!product.value) {
      toastError({ title: 'Error', description: 'Product not found' })
      return
    }

    cartStore.addItem({
      id: product.value.id,
      name: product.value.title,
      price: product.value.price,
      quantity: quantity.value,
      image: product.value.image,
    })

    success({
      title: 'Added to cart!',
      description: `${quantity.value}x ${product.value.title} added to your cart`,
    })

    quantity.value = 1
  }

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
    },
  })
</script>

<template>
  <!-- Pull to Refresh Indicator -->
  <PullToRefresh :pull-distance="pullDistance" :is-refreshing="isRefreshing" />

  <!-- Header with Actions -->
  <Header>
    <template #actions>
      <IconButton variant="tertiary" size="md" title="Share" @click="handleShare">
        <Share2 class="h-5 w-5" />
      </IconButton>

      <IconButton
        variant="tertiary"
        size="md"
        :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
        @click="toggleFavorite"
      >
        <Heart class="h-5 w-5" :fill="isFavorited ? 'currentColor' : 'none'" />
      </IconButton>

      <CartActionItem :on-click="() => void router.push('/cart')" />
    </template>
  </Header>

  <!-- Content with Fixed Header Gap and Footer Padding -->
  <div class="pt-14 pb-20">
    <!-- Loading State -->
    <template v-if="isLoading">
      <Skeleton class="aspect-square w-full" />
      <div class="space-y-3 px-4 pt-4">
        <Skeleton class="h-5 w-20" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-20 w-full" />
      </div>
    </template>

    <!-- Error State -->
    <EmptyState
      v-else-if="error"
      title="Error loading product"
      :description="error.message"
      :image="AlertCircle"
    >
      <template #actions>
        <Button @click="() => refetch()">Try Again</Button>
      </template>
    </EmptyState>

    <!-- Product Detail -->
    <template v-else-if="product">
      <!-- Product Image Section -->
      <ProductImage :product="product" />

      <!-- Product Details -->
      <div class="flex flex-1 flex-col px-4 pt-4">
        <!-- Product Info (Category, Title, Rating, Price) -->
        <ProductInfo :product="product" />

        <!-- Divider -->
        <div class="my-3 border-t border-neutral-200" />

        <!-- Product Description -->
        <ProductDescription :product="product" />
      </div>

      <!-- Product Actions (Buy / Add to Cart / Cancel) -->
      <ProductActions :on-add-to-cart="addToCart" :on-cancel="() => router.back()" />
    </template>
  </div>
</template>
