/**
 * Product Service (Demo)
 * Handles product-related API calls using DummyJSON API
 * This is a demo service for demonstration purposes
 */

import { createHttpClient } from '../http'

// ============================================
// HTTP Client (uses external DummyJSON API)
// ============================================

const demoHttp = createHttpClient('https://dummyjson.com', 'none')

// ============================================
// Types
// ============================================

interface DummyProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  images: string[]
  thumbnail: string
  rating: number
  stock: number
  brand?: string
  discountPercentage?: number
  reviews?: unknown[]
}

interface DummyProductResponse {
  products: DummyProduct[]
  total: number
  skip: number
  limit: number
}

interface DummyCategory {
  slug: string
  name: string
  url: string
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface ProductFilters {
  category?: string
  search?: string
  sort?: 'asc' | 'desc'
}

export interface ProductPaginationParams {
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

// ============================================
// Adapter
// ============================================

const productAdapter = {
  fromApi(dummyProduct: DummyProduct): Product {
    return {
      id: dummyProduct.id,
      title: dummyProduct.title,
      price: dummyProduct.price,
      description: dummyProduct.description,
      category: dummyProduct.category,
      image: dummyProduct.thumbnail,
      rating: {
        rate: dummyProduct.rating,
        count: dummyProduct.reviews?.length ?? Math.round(dummyProduct.rating * 10),
      },
    }
  },

  fromApiList(products: DummyProduct[]): Product[] {
    return products.map(p => this.fromApi(p))
  },
}

// ============================================
// Service
// ============================================

export const productService = {
  /**
   * Get all products with filters and pagination
   */
  async getAll(
    filters: ProductFilters = {},
    pagination: ProductPaginationParams = {},
  ): Promise<ProductListResponse> {
    const { category, search, sort } = filters
    const { page = 1, limit = 12 } = pagination

    const skip = (page - 1) * limit
    const params: Record<string, string | number> = {
      limit,
      skip,
      sortBy: 'price',
      order: sort === 'desc' ? 'desc' : 'asc',
    }

    let endpoint = '/products'

    if (search) {
      endpoint = '/products/search'
      params.q = search
    } else if (category && category !== 'all') {
      endpoint = `/products/category/${encodeURIComponent(category)}`
    }

    const { data } = await demoHttp.get<DummyProductResponse>(endpoint, { params })

    return {
      products: productAdapter.fromApiList(data.products),
      total: data.total,
      page,
      totalPages: Math.ceil(data.total / limit),
    }
  },

  /**
   * Get product categories
   */
  async getCategories(): Promise<string[]> {
    const { data } = await demoHttp.get<DummyCategory[]>('/products/categories')

    return data.map(cat => cat.slug)
  },

  /**
   * Get single product by ID
   */
  async getById(id: number): Promise<Product> {
    const { data } = await demoHttp.get<DummyProduct>(`/products/${id}`)

    return productAdapter.fromApi(data)
  },

  /**
   * Get total product count with filters
   */
  async getCount(filters: ProductFilters = {}): Promise<number> {
    const result = await this.getAll(filters, { page: 1, limit: 1 })
    return result.total
  },
}
