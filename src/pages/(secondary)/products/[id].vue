<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProduct } from '@/composables/services/useProducts'
  import { usePullToRefresh, useToast } from '@/composables/ui'
  import { useCartStore } from '@/stores/cart'
  import { Skeleton } from '@/components/ui/skeleton'
  import { ErrorState, PullToRefresh } from '@/components/shared'
  import { CartActionItem } from '@/components/layout'
  import {
    ProductImage,
    ProductInfo,
    ProductDescription,
    ProductActions,
  } from '@/components/products'

  const router = useRouter()

  definePage({
    meta: {
      title: 'Product Detail',
      header: {
        subtitle: 'Browse detailed information',
        rightActions: [
          {
            id: 'share',
            label: 'Share',
            icon: 'share-2',
          },
          {
            id: 'favorite',
            label: 'Add to Favorites',
            icon: 'heart',
          },
        ],
      },
    },
  })

  const route = useRoute('/(secondary)/products/[id]')
  const cartStore = useCartStore()
  const { success, error: toastError } = useToast()

  const productId = computed(() => Number(route.params.id))
  const quantity = ref(1)

  const { data: product, isLoading, error, refetch } = useProduct(productId)

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
  <!-- Cart action teleported to header -->
  <Teleport to="#header-actions-teleport">
    <CartActionItem :on-click="() => void router.push('/cart')" />
  </Teleport>

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
        <div class="my-3 border-t border-neutral-200" />

        <!-- Product Description -->
        <ProductDescription :product="product" />
      </div>

      <!-- Product Actions (Buy / Add to Cart / Cancel) -->
      <ProductActions :on-add-to-cart="addToCart" :on-cancel="() => router.back()" />
    </template>
  </div>
</template>
