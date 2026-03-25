import {
  ensureValidWhatsAppShopPhone,
  getWhatsAppPhoneDigits,
  siteConfig,
} from '../config/site'
import { formatUnitDh } from './catalogPricing'
import type { Product } from '../types/product'
import type { CartLine } from './pricing'
import type { PackOfferMode } from './pricing'
import { computeTotals } from './pricing'

/** Longueur max. du texte prérempli (URL WhatsApp — évite les liens cassés). */
const MAX_PREFILL_CHARS = 1800

/**
 * Numéro uniquement en chiffres, format international sans + ni 0 initial.
 * Maroc : 06/07… national → 2126…/2127… ; 9 chiffres commençant par 6 ou 7 → préfixe 212.
 */
export function normalizeWhatsAppPhoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.length === 10 && d.startsWith('0') && (d[1] === '6' || d[1] === '7')) {
    d = `212${d.slice(1)}`
  }
  if (d.length === 9 && (d.startsWith('6') || d.startsWith('7'))) {
    d = `212${d}`
  }
  return d
}

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
  },
  orderRef: string
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
      if (packApplied) {
        return `• ${p.brand} ${p.name} × ${line.qty}`
      }
      return `• ${p.brand} ${p.name} × ${line.qty} — ${formatUnitDh(p.priceDh)}/u`
    })
    .filter(Boolean)
    .join('\n')

  const parts = [
    `Commande ${siteConfig.shopName}`,
    '',
    `N° DE COMMANDE : ${orderRef}`,
    '(À indiquer au livreur — même numéro sur votre ticket)',
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
    'LIVREUR — vérifier le N° de commande et le montant avant remise du colis.',
    '',
    'Paiement uniquement en espèces à la livraison.',
  ]

  return parts.filter((x) => x !== '').join('\n')
}

export function whatsappOrderUrl(
  lines: CartLine[],
  productList: Product[],
  packOffer: PackOfferMode,
  customer: Parameters<typeof buildOrderMessage>[3],
  orderRef: string
): string {
  const phone = ensureValidWhatsAppShopPhone(
    normalizeWhatsAppPhoneDigits(getWhatsAppPhoneDigits())
  )
  let text = buildOrderMessage(lines, productList, packOffer, customer, orderRef)
  if (text.length > MAX_PREFILL_CHARS) {
    text =
      text.slice(0, MAX_PREFILL_CHARS - 80).trim() +
      '\n\n[…] Message tronqué — détail sur le ticket de commande.'
  }

  const params = new URLSearchParams()
  params.set('phone', phone)
  params.set('text', text)

  /** `api.whatsapp.com` est en général plus fiable que `wa.me` (mobile / Safari). */
  return `https://api.whatsapp.com/send?${params.toString()}`
}
