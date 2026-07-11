export interface Category {
  id: number
  name: string
  slug: string
  parent?: string
  productsCount: number
  isPublished: boolean
  updatedAt: string
}

export type CategoryFormValues = Pick<Category, 'name' | 'slug' | 'parent' | 'isPublished'>
