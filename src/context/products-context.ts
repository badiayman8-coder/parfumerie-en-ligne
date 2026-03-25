import { createContext } from 'react'
import type { Product } from '../types/product'
import type { ImageOverrides } from '../lib/productImageOverrides'

export type ProductsContextValue = {
  products: Product[]
  getProduct: (id: string) => Product | undefined
  overrides: ImageOverrides
  setProductImages: (
    id: string,
    patch: Partial<Pick<Product, 'imageOfficial' | 'imageStock'>>
  ) => void
  resetImageOverrides: () => void
  exportProductsJson: () => void
}

export const ProductsContext = createContext<ProductsContextValue | null>(null)
