/** Configuration boutique — à adapter (WhatsApp, Instagram, prix). */
export const siteConfig = {
  shopName: 'Parfumerie 33',
  shopTagline: 'Décomptes 33 ml · Liquidation de stock',
  /** Prix d’un flacon : livraison incluse dans ce prix. */
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
  whatsappPhoneE164: '212600000000',
  instagramHandle: 'votre_compte_insta',
  instagramUrl: 'https://instagram.com/votre_compte_insta',
  amana:
    'Les envois sont préparés pour expédition via le réseau Amana (point relais / livraison selon zone).',
  contactEmail: 'contact@example.com',
  promoBanner:
    '130 dh le flacon, livraison incluse. Packs 2 ou 3 parfums (mix homme/femme) — paiement en espèces à la livraison.',
} as const

/** Alias pour textes qui parlent encore de « prix par défaut ». */
export const defaultUnitPriceDh = siteConfig.unitPriceDh
