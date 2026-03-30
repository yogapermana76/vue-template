/**
 * Product Service
 * Handles all product-related API operations with type validation
 */

import { z } from 'zod'
import { http } from './http'

// ============================================
// Zod Schemas for Runtime Validation
// ============================================

const DummyProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  images: z.array(z.string()),
  thumbnail: z.string(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string().optional(),
  discountPercentage: z.number().optional(),
  reviews: z.array(z.unknown()).optional(), // For review count
})

const DummyProductResponseSchema = z.object({
  products: z.array(DummyProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

const DummyCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
})

// ============================================
// TypeScript Interfaces
// ============================================

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

export interface PaginationParams {
  page?: number
  limit?: number
}

// Infer types from Zod schemas
type DummyProduct = z.infer<typeof DummyProductSchema>

// ============================================
// Data Transformers (Adapter Pattern)
// ============================================

/**
 * Transform DummyJSON product to our Product interface
 * Single Responsibility: Only handles data transformation
 */
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
        // Use reviews array length if available, otherwise derive from rating
        count: dummyProduct.reviews?.length ?? Math.round(dummyProduct.rating * 10),
      },
    }
  },

  fromApiList(products: DummyProduct[]): Product[] {
    return products.map(p => this.fromApi(p))
  },
}

// ============================================
// Product Service
// ============================================

export const productService = {
  /**
   * Get all products with filters and pagination
   */
  async getAll(
    filters: ProductFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const { category, search, sort } = filters
    const { page = 1, limit = 12 } = pagination

    const skip = (page - 1) * limit
    const sortBy = 'price'
    const order = sort === 'desc' ? 'desc' : 'asc'

    let endpoint = '/products'
    const params: Record<string, string | number> = {
      limit,
      skip,
      sortBy,
      order,
    }

    if (search) {
      endpoint = '/products/search'
      params.q = search
    } else if (category && category !== 'all') {
      endpoint = `/products/category/${encodeURIComponent(category)}`
    }

    const { data } = await http.get(endpoint, { params })

    const validated = DummyProductResponseSchema.parse(data)
    const totalPages = Math.ceil(validated.total / limit)

    return {
      products: productAdapter.fromApiList(validated.products),
      total: validated.total,
      page,
      totalPages,
    }
  },

  /**
   * Get product categories
   */
  async getCategories(): Promise<string[]> {
    const { data } = await http.get('/products/categories')

    const validated = z.array(DummyCategorySchema).parse(data)

    return validated.map(cat => cat.slug)
  },

  /**
   * Get single product by ID
   */
  async getById(id: number): Promise<Product> {
    const { data } = await http.get(`/products/${id}`)

    const validated = DummyProductSchema.parse(data)

    return productAdapter.fromApi(validated)
  },

  /**
   * Get total product count with filters
   */
  async getCount(filters: ProductFilters = {}): Promise<number> {
    const result = await this.getAll(filters, { page: 1, limit: 1 })
    return result.total
  },
}
