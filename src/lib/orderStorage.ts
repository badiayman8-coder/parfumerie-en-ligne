import type { CartLine } from './pricing'
import type { PackOfferMode } from './pricing'

const PREFIX = 'parfumerie_order_v1_'
const LAST_KEY = 'parfumerie_last_order_ref_v1'

export type StoredOrderPayload = {
  orderRef: string
  createdAt: string
  lines: CartLine[]
  packOffer: PackOfferMode
  customer: {
    name: string
    phone: string
    city: string
    address: string
    notes: string
  }
}

function storage() {
  return typeof window !== 'undefined' ? window.localStorage : null
}

export function saveConfirmedOrder(payload: StoredOrderPayload) {
  const s = storage()
  if (!s) return
  s.setItem(`${PREFIX}${payload.orderRef}`, JSON.stringify(payload))
  s.setItem(LAST_KEY, payload.orderRef)
}

export function loadConfirmedOrder(orderRef: string): StoredOrderPayload | null {
  const s = storage()
  if (!s) return null
  try {
    const raw = s.getItem(`${PREFIX}${orderRef}`)
    if (!raw) return null
    return JSON.parse(raw) as StoredOrderPayload
  } catch {
    return null
  }
}

export function getLastOrderRef(): string | null {
  const s = storage()
  if (!s) return null
  return s.getItem(LAST_KEY)
}
