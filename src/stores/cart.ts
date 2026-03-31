/**
 * Cart Store - Global state management for shopping cart
 * Uses Pinia for reactive state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  sku?: string
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])

  // Computed
  const cartCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))

  const cartTotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  const uniqueItems = computed(() => items.value.length)

  // Actions
  const addItem = (product: CartItem) => {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      // Item already in cart, increase quantity
      existingItem.quantity += product.quantity
    } else {
      // New item to cart
      items.value.push(product)
    }
  }

  const removeItem = (productId: string | number) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  const updateQuantity = (productId: string | number, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    // State
    items,

    // Computed
    cartCount,
    cartTotal,
    uniqueItems,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
