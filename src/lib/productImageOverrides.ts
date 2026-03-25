import type { Product } from '../types/product'

const STORAGE_KEY = 'parfumerie_image_overrides_v1'

export type ImageOverrides = Record<
  string,
  { imageOfficial?: string; imageStock?: string }
>

export function loadImageOverrides(): ImageOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ImageOverrides
  } catch {
    return {}
  }
}

export function saveImageOverrides(o: ImageOverrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(o))
}

export function mergeProductImages(
  base: Product[],
  overrides: ImageOverrides
): Product[] {
  return base.map((p) => {
    const o = overrides[p.id]
    if (!o) return p
    return {
      ...p,
      imageOfficial: o.imageOfficial ?? p.imageOfficial,
      imageStock: o.imageStock !== undefined ? o.imageStock : p.imageStock,
    }
  })
}
