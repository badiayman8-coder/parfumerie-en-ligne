import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { productsByGender } from '../data/products'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { catalogHasMixedUnitPrices } from '../lib/catalogPricing'
import { cartTotalUnits } from '../lib/pricing'
import { clearPackFlow, getPackFlow, type PackFlowState } from '../lib/packComposer'
import type { Gender } from '../types/product'

const filters: { id: Gender | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'femme', label: 'Femme' },
  { id: 'homme', label: 'Homme' },
]

export function Collection() {
  const { products } = useProducts()
  const { lines } = useCart()
  const [params, setParams] = useSearchParams()
  const genderParam = params.get('genre') as Gender | 'tous' | null
  const gender: Gender | 'tous' =
    genderParam && ['femme', 'homme', 'tous'].includes(genderParam)
      ? genderParam
      : 'tous'

  const [query, setQuery] = useState('')
  /** Force re-render après annulation pack (session vidée sans changement du panier). */
  const [packUiTick, setPackUiTick] = useState(0)

  const units = cartTotalUnits(lines)

  const compose = useMemo((): PackFlowState | null => {
    void packUiTick
    const flow = getPackFlow()
    if (!flow) return null
    const seedInCart = lines.some(
      (l) => l.productId === flow.seedProductId && l.qty >= 1
    )
    if (!seedInCart || lines.length === 0) return null
    return flow
  }, [lines, packUiTick])

  useEffect(() => {
    const flow = getPackFlow()
    if (!flow) return
    const seedInCart = lines.some(
      (l) => l.productId === flow.seedProductId && l.qty >= 1
    )
    if (!seedInCart || lines.length === 0) {
      clearPackFlow()
    }
  }, [lines])

  const showUnitPrice = catalogHasMixedUnitPrices(products)

  const list = useMemo(() => {
    const base = productsByGender(products, gender)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
    )
  }, [gender, query, products])

  function setGender(g: Gender | 'tous') {
    const next = new URLSearchParams(params)
    if (g === 'tous') next.delete('genre')
    else next.set('genre', g)
    setParams(next)
  }

  return (
    <div className="space-y-6">
      {compose ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
          <p className="font-semibold">Pack {compose.target} — composition en cours</p>
          <p className="mt-2 text-emerald-900">
            <strong>{compose.seedLabel}</strong> est déjà dans votre panier (1er parfum).
            Choisissez{' '}
            {compose.target === 2 ? '1 autre' : '2 autres'} parfum(s) ci-dessous, ouvrez
            la fiche et ajoutez au panier.             Ensuite ouvrez la{' '}
            <Link to="/commande" className="font-bold underline">
              commande
            </Link>{' '}
            : le tarif pack s&apos;applique tout seul à 2 ou 3 flacons.
          </p>
          <p className="mt-2 text-xs text-emerald-800">
            Panier actuel : {units} flacon{units > 1 ? 's' : ''} — objectif{' '}
            {compose.target} flacons.
            {units >= compose.target ? (
              <>
                {' '}
                <Link to="/commande" className="font-semibold underline">
                  Finaliser le pack →
                </Link>
              </>
            ) : null}
          </p>
          <button
            type="button"
            onClick={() => {
              clearPackFlow()
              setPackUiTick((t) => t + 1)
              const next = new URLSearchParams(params)
              next.delete('pack')
              setParams(next)
            }}
            className="mt-3 text-xs font-medium text-emerald-800 underline"
          >
            Annuler le mode pack
          </button>
        </div>
      ) : null}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Boutique</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Flacons 33 ml — filtrez par univers ou recherchez une référence.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setGender(f.id)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition',
                gender === f.id
                  ? 'bg-black text-white'
                  : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex w-full max-w-sm items-center gap-2 sm:w-auto">
          <span className="sr-only">Recherche</span>
          <input
            type="search"
            placeholder="Rechercher…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none ring-black focus:ring-2"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
          Aucun résultat pour cette recherche.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} showUnitPrice={showUnitPrice} />
          ))}
        </div>
      )}
    </div>
  )
}
