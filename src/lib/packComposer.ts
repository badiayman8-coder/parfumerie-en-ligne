/** Mode composition pack : 1er parfum ajouté au panier, puis choix des suivants dans le catalogue. */

const STORAGE_KEY = 'parfumerie_pack_flow_v1'

export type PackFlowState = {
  target: 2 | 3
  seedProductId: string
  seedLabel: string
}

export function getPackFlow(): PackFlowState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as PackFlowState
    if (v.target !== 2 && v.target !== 3) return null
    if (!v.seedProductId || !v.seedLabel) return null
    return v
  } catch {
    return null
  }
}

export function startPackFlow(
  target: 2 | 3,
  seedProductId: string,
  seedLabel: string
) {
  const state: PackFlowState = { target, seedProductId, seedLabel }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearPackFlow() {
  sessionStorage.removeItem(STORAGE_KEY)
}

const OPEN_CART_KEY = 'parfumerie_open_cart_v1'

/** Après navigation (ex. vers la boutique), ouvrir le tiroir « Ma commande ». */
export function flagOpenCartDrawer() {
  sessionStorage.setItem(OPEN_CART_KEY, '1')
}

export function consumeOpenCartDrawer(): boolean {
  if (typeof window === 'undefined') return false
  if (sessionStorage.getItem(OPEN_CART_KEY) !== '1') return false
  sessionStorage.removeItem(OPEN_CART_KEY)
  return true
}
