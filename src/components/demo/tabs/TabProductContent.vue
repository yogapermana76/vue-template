<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { SearchInput } from '@/components/shared'
  import ProductCard from '@/components/demo/products/ProductCard.vue'
  import ProductCardSkeleton from '@/components/demo/products/ProductCardSkeleton.vue'
  import ProductGrid from '@/components/demo/products/ProductGrid.vue'
  import { productService, type Product } from '@/services/product'

  const router = useRouter()
  const searchQuery = ref('')
  const products = ref<Product[]>([])
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const result = await productService.getAll({}, { limit: 4 })
      products.value = result.products
    } finally {
      isLoading.value = false
    }
  })

  const handleSearchFocus = () => {
    // Navigate to search products page when search input is focused/clicked
    router.push('/products/search-products')
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar - clickable to open dedicated search page -->
    <SearchInput
      v-model="searchQuery"
      placeholder="Search products..."
      readonly
      @focus="handleSearchFocus"
      @click="handleSearchFocus"
    />

    <!-- Product Grid -->
    <ProductGrid>
      <template v-if="isLoading">
        <ProductCardSkeleton v-for="i in 4" :key="i" />
      </template>
      <template v-else>
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </template>
    </ProductGrid>
  </div>
</template>
