import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { siteConfig } from '../config/site'
import { catalogHasMixedUnitPrices } from '../lib/catalogPricing'
import { useProducts } from '../hooks/useProducts'

export function Home() {
  const { products } = useProducts()
  const featured = products.slice(0, 4)
  const showUnitPrice = catalogHasMixedUnitPrices(products)

  return (
    <div className="space-y-12">
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Liquidation · 33 ml
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {siteConfig.shopTagline}
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Flacons voyage <strong>33 ml</strong> (1,14 fl. oz.), emballage uniforme. Visuels
          type revendeur pour vous projeter ; photos réelles du stock sur chaque fiche
          (onglet « Photo stock »). Tarifs <strong>standard et premium</strong> (livraison
          incluse au flacon) ; les <strong>packs 2 ou 3</strong> s&apos;appliquent à tout le
          catalogue. Paiement uniquement en espèces à la livraison.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/collection"
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Voir la boutique
          </Link>
          <Link
            to="/packs"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Offres packs
          </Link>
        </div>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {siteConfig.promoBanner}
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Sélection</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Flacons standard {siteConfig.standardUnitPriceDh} {siteConfig.currency},
              premium {siteConfig.premiumUnitMinDh}–{siteConfig.premiumUnitMaxDh}{' '}
              {siteConfig.currency} — packs {siteConfig.pack2TotalDh} /{' '}
              {siteConfig.pack3TotalDh} {siteConfig.currency} (2 ou 3 flacons, tout parfum).
            </p>
          </div>
          <Link to="/collection" className="text-sm font-medium underline-offset-4 hover:underline">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} showUnitPrice={showUnitPrice} />
          ))}
        </div>
      </section>
    </div>
  )
}
