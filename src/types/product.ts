export type Gender = 'femme' | 'homme' | 'unisex'

export interface Product {
  id: string
  brand: string
  name: string
  gender: Gender
  priceDh: number
  volumeMl: number
  imageOfficial: string
  imageStock?: string
  notes?: string
  promoBadge?: string | null
}
