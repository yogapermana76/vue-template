<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { SearchInput } from '@/components/shared'
  import ProductCard from '@/components/products/ProductCard.vue'
  import ProductCardSkeleton from '@/components/products/ProductCardSkeleton.vue'
  import ProductGrid from '@/components/products/ProductGrid.vue'
  import { productService, type Product } from '@/services/product'

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
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <SearchInput v-model="searchQuery" placeholder="Search products..." />

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
