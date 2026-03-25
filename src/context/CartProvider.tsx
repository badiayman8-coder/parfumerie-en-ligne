import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '../lib/pricing'
import type { PackOfferMode } from '../lib/pricing'
import { cartTotalUnits } from '../lib/pricing'
import { CartContext } from './cart-context'

function mergeAdd(prev: CartLine[], productId: string, qty: number): CartLine[] {
  const i = prev.findIndex((l) => l.productId === productId)
  if (i === -1) return [...prev, { productId, qty }]
  const next = [...prev]
  next[i] = { productId, qty: next[i].qty + qty }
  return next
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [packOffer, setPackOffer] = useState<PackOfferMode>('none')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openCart = useCallback(() => setDrawerOpen(true), [])
  const closeCart = useCallback(() => setDrawerOpen(false), [])

  /** Dès qu’il y a 2 ou 3 flacons au total, appliquer le tarif pack (panier + facture finale). */
  const syncPackOfferToFlow = useCallback((nextLines: CartLine[]) => {
    const u = cartTotalUnits(nextLines)
    if (u === 2) setPackOffer('pack2')
    else if (u === 3) setPackOffer('pack3')
    else setPackOffer('none')
  }, [])

  const add = useCallback((productId: string, qty = 1) => {
    setLines((prev) => {
      const next = mergeAdd(prev, productId, qty)
      queueMicrotask(() => syncPackOfferToFlow(next))
      return next
    })
  }, [syncPackOfferToFlow])

  const setQty = useCallback(
    (productId: string, qty: number) => {
      setLines((prev) => {
        let next: CartLine[]
        if (qty <= 0) {
          next = prev.filter((l) => l.productId !== productId)
        } else {
          const i = prev.findIndex((l) => l.productId === productId)
          if (i === -1) next = [...prev, { productId, qty }]
          else {
            next = [...prev]
            next[i] = { productId, qty }
          }
        }
        queueMicrotask(() => syncPackOfferToFlow(next))
        return next
      })
    },
    [syncPackOfferToFlow]
  )

  const remove = useCallback(
    (productId: string) => {
      setLines((prev) => {
        const next = prev.filter((l) => l.productId !== productId)
        queueMicrotask(() => syncPackOfferToFlow(next))
        return next
      })
    },
    [syncPackOfferToFlow]
  )

  const clear = useCallback(() => {
    setLines([])
    setPackOffer('none')
  }, [])

  const value = useMemo(
    () => ({
      lines,
      add,
      setQty,
      remove,
      clear,
      packOffer,
      setPackOffer,
      drawerOpen,
      openCart,
      closeCart,
    }),
    [lines, add, setQty, remove, clear, packOffer, drawerOpen, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
