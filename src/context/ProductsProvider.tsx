import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../types/product'
import { baseProducts } from '../data/products'
import {
  loadImageOverrides,
  mergeProductImages,
  saveImageOverrides,
  type ImageOverrides,
} from '../lib/productImageOverrides'
import { ProductsContext } from './products-context'

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<ImageOverrides>(() => loadImageOverrides())

  const products = useMemo(
    () => mergeProductImages(baseProducts, overrides),
    [overrides]
  )

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  )

  const setProductImages = useCallback(
    (id: string, patch: Partial<Pick<Product, 'imageOfficial' | 'imageStock'>>) => {
      setOverrides((prev) => {
        const next: ImageOverrides = {
          ...prev,
          [id]: { ...prev[id], ...patch },
        }
        saveImageOverrides(next)
        return next
      })
    },
    []
  )

  const resetImageOverrides = useCallback(() => {
    setOverrides({})
    saveImageOverrides({})
  }, [])

  const exportProductsJson = useCallback(() => {
    const json = JSON.stringify(products, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [products])

  const value = useMemo(
    () => ({
      products,
      getProduct,
      overrides,
      setProductImages,
      resetImageOverrides,
      exportProductsJson,
    }),
    [
      products,
      getProduct,
      overrides,
      setProductImages,
      resetImageOverrides,
      exportProductsJson,
    ]
  )

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  )
}
