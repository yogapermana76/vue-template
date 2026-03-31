<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Search } from 'lucide-vue-next'
  import { Input } from '@/components/ui/input'
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
    <div class="relative">
      <Search class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="h-11 rounded-xl pl-10"
      />
    </div>

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
