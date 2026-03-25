import { Link } from 'react-router-dom'
import { getWhatsAppPhoneDigits, siteConfig } from '../config/site'
import { normalizeWhatsAppPhoneDigits } from '../lib/whatsapp'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {siteConfig.shopName}
          </p>
          <p className="mt-2 text-sm text-neutral-600">{siteConfig.shopTagline}</p>
        </div>
        <div className="text-sm text-neutral-600">
          <p className="font-medium text-neutral-900">Livraison</p>
          <p className="mt-2">{siteConfig.amana}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium text-neutral-900">Contact</p>
          <a
            href={`https://api.whatsapp.com/send?phone=${normalizeWhatsAppPhoneDigits(getWhatsAppPhoneDigits())}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block font-medium text-emerald-800 underline-offset-4 hover:underline"
          >
            WhatsApp boutique
          </a>
          <p className="mt-3 font-medium text-neutral-900">Suivez-nous</p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-neutral-600 underline-offset-4 hover:underline"
          >
            Instagram @{siteConfig.instagramHandle}
          </a>
          <p className="mt-3 text-neutral-500">
            Paiement en espèces à la livraison uniquement.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        <Link to="/mentions" className="hover:underline">
          Mentions & conditions
        </Link>
        <span className="mx-2">·</span>
        <Link to="/admin" className="hover:underline">
          Admin photos
        </Link>
        <span className="mx-2">·</span>
        <span>Flacons 33 ml — sous réserve de disponibilité</span>
      </div>
    </footer>
  )
}
