/**
 * Numéro WhatsApp boutique — +212 778 956 714 (chiffres seuls, sans +).
 * Seule source de vérité : plus de variable d’environnement (évite Vercel / ancien 212600…).
 */
export const WHATSAPP_SHOP_DIGITS = '212778956714'

/** Placeholders invalides — jamais utilisés pour un lien (voir `ensureValidWhatsAppShopPhone`). */
const INVALID_WHATSAPP_PLACEHOLDERS = new Set(['212600000000', '21260000000'])

export function getWhatsAppPhoneDigits(): string {
  return WHATSAPP_SHOP_DIGITS
}

/** Dernière ligne de défense si un ancien build ou bug passait encore le faux numéro. */
export function ensureValidWhatsAppShopPhone(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length < 11 || INVALID_WHATSAPP_PLACEHOLDERS.has(d)) {
    return WHATSAPP_SHOP_DIGITS
  }
  return d
}

/** Affichage lisible du numéro boutique (pied de page, vérif visuelle). */
export function formatWhatsAppShopDisplay(): string {
  const d = WHATSAPP_SHOP_DIGITS
  if (d.length === 12 && d.startsWith('212')) {
    return `+212 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
  }
  return `+${d}`
}

/** Configuration boutique — à adapter (WhatsApp, Instagram, prix). */
export const siteConfig = {
  shopName: 'Parfumerie 33',
  shopTagline: 'Décomptes 33 ml · Liquidation de stock',
  /** Flacon « entrée de gamme » / standard — livraison incluse. */
  standardUnitPriceDh: 130,
  /** Premium : 140 ou 150 dh selon la référence (voir fiche produit). */
  premiumUnitMinDh: 140,
  premiumUnitMaxDh: 150,
  /** @deprecated utiliser standardUnitPriceDh */
  unitPriceDh: 130,
  /** Supplément livraison hors logique pack (souvent 0 si tout est inclus au flacon). */
  deliveryPerOrderDh: 0,
  priceIncludesShipping: true,
  currency: 'dh',
  /** Totaux packs (modifiables) — 2 ou 3 parfums composables homme/femme. */
  pack2TotalDh: 240,
  pack3TotalDh: 330,
  pack2Title: 'Pack 2 parfums',
  pack3Title: 'Pack 3 parfums',
  instagramHandle: 'votre_compte_insta',
  instagramUrl: 'https://instagram.com/votre_compte_insta',
  amana:
    'Les envois sont préparés pour expédition via le réseau Amana (point relais / livraison selon zone).',
  contactEmail: 'contact@example.com',
  promoBanner:
    'Flacons standard à partir de 130 dh, premium 140–150 dh (livraison incluse). Packs 2 ou 3 : mêmes totaux pour tout le catalogue — paiement en espèces à la livraison.',
} as const

/** Alias pour textes qui parlent encore de « prix par défaut ». */
export const defaultUnitPriceDh = siteConfig.standardUnitPriceDh
