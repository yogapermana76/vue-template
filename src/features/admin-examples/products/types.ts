export type ProductStatus = 'active' | 'inactive' | 'out_of_stock'

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  brand: string
  description?: string
  price: number
  cost: number
  margin: number
  stock: number
  status: ProductStatus
  supplier: string
  warehouse: string
  createdAt: string
}

export type ProductFormValues = Omit<Product, 'id' | 'margin' | 'createdAt'>

export type ProductStatusFilter = 'all' | ProductStatus
