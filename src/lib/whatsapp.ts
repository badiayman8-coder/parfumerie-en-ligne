import { siteConfig } from '../config/site'
import type { Product } from '../types/product'
import type { CartLine } from './pricing'
import type { PackOfferMode } from './pricing'
import { computeTotals } from './pricing'

export function buildOrderMessage(
  lines: CartLine[],
  productList: Product[],
  packOffer: PackOfferMode,
  customer: {
    name: string
    phone: string
    city: string
    address: string
    notes?: string
  }
): string {
  const { subtotalDh, deliveryDh, totalDh, packApplied, packLabel } = computeTotals(
    lines,
    productList,
    packOffer
  )

  const linesText = lines
    .map((line) => {
      const p = productList.find((x) => x.id === line.productId)
      if (!p) return ''
      return `• ${p.brand} ${p.name} × ${line.qty} — ${p.priceDh} ${siteConfig.currency}/u`
    })
    .filter(Boolean)
    .join('\n')

  const parts = [
    `Commande ${siteConfig.shopName}`,
    '',
    'CLIENT',
    `Nom : ${customer.name}`,
    `Tél : ${customer.phone}`,
    `Ville : ${customer.city}`,
    `Adresse / point relais : ${customer.address}`,
    customer.notes ? `Notes : ${customer.notes}` : '',
    '',
    'DÉTAIL',
    linesText,
    '',
    packApplied
      ? `${packLabel} : ${subtotalDh} ${siteConfig.currency} (livraison incluse dans l’offre)`
      : `Sous-total : ${subtotalDh} ${siteConfig.currency}`,
    packApplied ? '' : `Livraison : ${deliveryDh === 0 ? 'incluse au prix du flacon' : `${deliveryDh} ${siteConfig.currency}`}`,
    `TOTAL à payer en espèces à la livraison : ${totalDh} ${siteConfig.currency}`,
    '',
    'Paiement uniquement en espèces à la livraison.',
  ]

  return parts.filter((x) => x !== '').join('\n')
}

export function whatsappOrderUrl(
  lines: CartLine[],
  productList: Product[],
  packOffer: PackOfferMode,
  customer: Parameters<typeof buildOrderMessage>[3]
): string {
  const phone = siteConfig.whatsappPhoneE164.replace(/\D/g, '')
  const text = buildOrderMessage(lines, productList, packOffer, customer)
  const q = encodeURIComponent(text)
  return `https://wa.me/${phone}?text=${q}`
}
