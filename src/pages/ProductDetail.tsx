import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { QuantityStepper } from '../components/QuantityStepper'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { flagOpenCartDrawer, startPackFlow } from '../lib/packComposer'

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct } = useProducts()
  const product = id ? getProduct(id) : undefined
  const { add, openCart } = useCart()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'official' | 'stock'>('official')

  const img = useMemo(() => {
    if (!product) return ''
    return tab === 'stock' && product.imageStock ? product.imageStock : product.imageOfficial
  }, [product, tab])

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-600">Produit introuvable.</p>
        <Link to="/collection" className="mt-4 inline-block font-medium underline">
          Retour à la boutique
        </Link>
      </div>
    )
  }

  const p = product
  const label = `${p.brand} ${p.name}`

  function goPack2() {
    add(p.id, 1)
    startPackFlow(2, p.id, label)
    flagOpenCartDrawer()
    navigate('/collection?pack=2')
  }

  function goPack3() {
    add(p.id, 1)
    startPackFlow(3, p.id, label)
    flagOpenCartDrawer()
    navigate('/collection?pack=3')
  }

  return (
    <div className="mx-auto max-w-xl lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
      <div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
          <img
            src={img}
            alt={`${p.brand} ${p.name}`}
            className="aspect-square w-full object-cover"
            loading="eager"
          />
        </div>
        {p.imageStock ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setTab('official')}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide',
                tab === 'official'
                  ? 'bg-black text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600',
              ].join(' ')}
            >
              Visuel revendeur
            </button>
            <button
              type="button"
              onClick={() => setTab('stock')}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide',
                tab === 'stock'
                  ? 'bg-black text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600',
              ].join(' ')}
            >
              Photo stock
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-8 lg:mt-0">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {siteConfig.shopName}
        </p>
        <h1 className="mt-2 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
          {p.brand} {p.name}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {p.volumeMl} ml — même format pour toutes les références (emballage
          uniforme).
        </p>
        <p className="mt-4 text-2xl font-semibold tabular-nums">
          {p.priceDh.toFixed(2)} {siteConfig.currency}
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Prix <strong>livraison incluse</strong> pour un achat à l&apos;unité. Packs 2 ou 3
          parfums (mix homme/femme) : voir{' '}
          <Link to="/packs" className="font-medium underline underline-offset-2">
            la page Packs
          </Link>
          .
        </p>
        {p.notes ? (
          <p className="mt-6 text-sm leading-relaxed text-neutral-700">
            <span className="font-medium text-neutral-900">Note : </span>
            {p.notes}
          </p>
        ) : null}
        {p.promoBadge ? (
          <p className="mt-4 inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase text-white">
            {p.promoBadge}
          </p>
        ) : null}

        <div className="mt-8 space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900">Achat simple</h2>
            <p className="mt-1 text-xs text-neutral-600">
              Un ou plusieurs flacons au prix unitaire ({p.priceDh.toFixed(2)}{' '}
              {siteConfig.currency} / flacon, livraison incluse).
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium text-neutral-700">Quantité</p>
                <div className="mt-2">
                  <QuantityStepper value={qty} onChange={setQty} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  add(p.id, qty)
                  openCart()
                }}
                className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 sm:ml-auto sm:w-auto sm:min-w-[220px]"
              >
                Ajouter à ma commande
              </button>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-emerald-600/40 bg-gradient-to-b from-emerald-50/80 to-white p-5">
            <h2 className="text-sm font-semibold text-emerald-950">Packs (remise)</h2>
            <p className="mt-2 text-sm text-neutral-800">
              Un clic = le pack est activé : ce parfum est le 1er flacon. Vous choisissez
              ensuite le(s) autre(s) dans la boutique — tout apparaît dans « Ma commande » en
              bas de l’écran.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={goPack2}
                className="w-full rounded-full border-2 border-emerald-700 bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Activer le pack 2 — {siteConfig.pack2TotalDh} {siteConfig.currency} (2
                parfums)
              </button>
              <button
                type="button"
                onClick={goPack3}
                className="w-full rounded-full border-2 border-emerald-800 bg-white py-3.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-50"
              >
                Activer le pack 3 — {siteConfig.pack3TotalDh} {siteConfig.currency} (3
                parfums)
              </button>
            </div>
          </section>

          <p className="text-xs text-neutral-500">
            Paiement en espèces à la livraison uniquement. Commande validée par message
            (WhatsApp). Stock limité — disponibilité sous réserve.
          </p>
        </div>
      </div>
    </div>
  )
}
