import { useContext } from 'react'
import { ProductsContext } from '../context/products-context'

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts doit être utilisé dans ProductsProvider')
  return ctx
}
