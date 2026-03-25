import type { Product } from '../types/product'
import productsJson from './products.json'

export const baseProducts: Product[] = productsJson as Product[]

export function productsByGender(
  list: Product[],
  gender: Product['gender'] | 'tous'
) {
  if (gender === 'tous') return list
  return list.filter((p) => p.gender === gender)
}
