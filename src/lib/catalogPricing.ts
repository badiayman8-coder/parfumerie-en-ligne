import { siteConfig } from '../config/site'
import type { Product } from '../types/product'

/** Plusieurs tarifs unitaires au catalogue (ex. standard + premium) → afficher le prix sur chaque carte. */
export function catalogHasMixedUnitPrices(products: readonly Product[]): boolean {
  const set = new Set(products.map((p) => p.priceDh))
  return set.size > 1
}

export function isPremiumUnitPrice(product: Product): boolean {
  return product.priceDh > siteConfig.standardUnitPriceDh
}

export function formatUnitDh(n: number): string {
  return `${Math.round(n)} ${siteConfig.currency}`
}
