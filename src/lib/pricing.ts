import { siteConfig } from '../config/site'
import type { Product } from '../types/product'

export type CartLine = { productId: string; qty: number }

/** Mode d’offre pack au panier (2 ou 3 flacons). */
export type PackOfferMode = 'none' | 'pack2' | 'pack3'

export function cartTotalUnits(lines: readonly CartLine[]): number {
  return lines.reduce((s, l) => s + l.qty, 0)
}

export function computeTotals(
  lines: readonly CartLine[],
  productList: readonly Product[],
  packOffer: PackOfferMode
): {
  subtotalDh: number
  deliveryDh: number
  totalDh: number
  packApplied: boolean
  packLabel: string
} {
  const units = cartTotalUnits(lines)
  const cfg = siteConfig

  if (packOffer === 'pack2' && units === 2) {
    return {
      subtotalDh: cfg.pack2TotalDh,
      deliveryDh: 0,
      totalDh: cfg.pack2TotalDh,
      packApplied: true,
      packLabel: cfg.pack2Title,
    }
  }

  if (packOffer === 'pack3' && units === 3) {
    return {
      subtotalDh: cfg.pack3TotalDh,
      deliveryDh: 0,
      totalDh: cfg.pack3TotalDh,
      packApplied: true,
      packLabel: cfg.pack3Title,
    }
  }

  const subtotal = lines.reduce((sum, line) => {
    const p = productList.find((x) => x.id === line.productId)
    if (!p) return sum
    return sum + p.priceDh * line.qty
  }, 0)

  const delivery = subtotal > 0 ? cfg.deliveryPerOrderDh : 0

  return {
    subtotalDh: subtotal,
    deliveryDh: delivery,
    totalDh: subtotal + delivery,
    packApplied: false,
    packLabel: '',
  }
}
