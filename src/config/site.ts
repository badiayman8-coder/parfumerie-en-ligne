/** Numéro WhatsApp boutique — +212 778 956 714 (chiffres seuls, sans +). */
const DEFAULT_WHATSAPP_DIGITS = '212778956714'

/** Ancien placeholder du template — ignoré même si présent dans `.env` / Vercel. */
const INVALID_WHATSAPP_PLACEHOLDERS = new Set(['212600000000', '21260000000'])

/**
 * Numéro utilisé pour les liens `api.whatsapp.com` / commandes.
 * Priorité : `VITE_WHATSAPP_PHONE` au build si valide, sinon défaut ci-dessus.
 * Sur Vercel : supprimez toute variable `VITE_WHATSAPP_PHONE` pointant encore vers 212600…
 */
export function getWhatsAppPhoneDigits(): string {
  const raw = import.meta.env.VITE_WHATSAPP_PHONE
  if (typeof raw === 'string' && raw.trim()) {
    const d = raw.replace(/\D/g, '')
    if (d.length >= 11 && !INVALID_WHATSAPP_PLACEHOLDERS.has(d)) {
      return d
    }
  }
  return DEFAULT_WHATSAPP_DIGITS
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
