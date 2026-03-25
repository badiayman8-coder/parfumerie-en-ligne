/** Référence courte lisible (ex. P33-250325-A3F7) — à communiquer au livreur et au client. */
export function generateOrderReference(): string {
  const d = new Date()
  const y = String(d.getFullYear()).slice(2)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `P33-${y}${m}${day}-${rand}`
}
