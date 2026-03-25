import { createContext } from 'react'
import type { CartLine } from '../lib/pricing'
import type { PackOfferMode } from '../lib/pricing'

export type CartContextValue = {
  lines: CartLine[]
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  packOffer: PackOfferMode
  setPackOffer: (v: PackOfferMode) => void
  drawerOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
