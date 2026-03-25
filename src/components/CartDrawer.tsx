import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { QuantityStepper } from './QuantityStepper'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { catalogHasMixedUnitPrices, formatUnitDh } from '../lib/catalogPricing'
import { getPackFlow } from '../lib/packComposer'
import { cartTotalUnits, computeTotals } from '../lib/pricing'

export function CartDrawer() {
  const { products } = useProducts()
  const {
    lines,
    setQty,
    remove,
    packOffer,
    drawerOpen,
    closeCart,
  } = useCart()

  const units = cartTotalUnits(lines)
  const totals = computeTotals(lines, products, packOffer)
  const showLineUnitPrice = useMemo(
    () => catalogHasMixedUnitPrices(products) && !totals.packApplied,
    [products, totals.packApplied]
  )
  const flow = getPackFlow()
  const packRemaining =
    flow && units < flow.target ? flow.target - units : 0

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen, closeCart])

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

  if (!drawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end print:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fermer"
        onClick={closeCart}
      />
      <div
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 id="cart-drawer-title" className="text-lg font-semibold tracking-tight">
            Ma commande
          </h2>
          <button
            type="button"
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"
            aria-label="Fermer"
            onClick={closeCart}
          >
            <CloseIcon />
          </button>
        </div>

        {packRemaining > 0 ? (
          <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
            <p className="font-medium">Pack en cours</p>
            <p className="mt-1 text-emerald-900/90">
              Encore {packRemaining} parfum{packRemaining > 1 ? 's' : ''} à choisir dans la
              boutique (bouton « Boutique » en haut).
            </p>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <p className="text-center text-sm text-neutral-600">
              Aucun article pour l’instant. Parcourez la boutique pour ajouter des parfums.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {lines.map((line) => {
                const p = products.find((x) => x.id === line.productId)
                if (!p) return null
                return (
                  <li key={line.productId} className="flex gap-3 py-4 first:pt-0">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      <img
                        src={p.imageOfficial}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        {p.brand} {p.name}
                      </p>
                      {showLineUnitPrice ? (
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatUnitDh(p.priceDh)} / flacon
                        </p>
                      ) : null}
                      <div className="mt-2 flex items-center gap-3">
                        <QuantityStepper
                          value={line.qty}
                          onChange={(q) => setQty(line.productId, q)}
                        />
                        <button
                          type="button"
                          className="text-xs font-medium text-red-700 underline"
                          onClick={() => remove(line.productId)}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>
              {units === 0
                ? 'Aucun article'
                : `${units} article${units > 1 ? 's' : ''}`}
            </span>
            {totals.packApplied ? (
              <span className="font-medium text-emerald-800">{totals.packLabel}</span>
            ) : null}
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="text-xl font-semibold tabular-nums text-neutral-900">
              {totals.totalDh.toFixed(2)} {siteConfig.currency}
            </span>
          </div>
          {totals.deliveryDh > 0 ? (
            <p className="mt-1 text-xs text-neutral-500">
              Dont livraison {totals.deliveryDh.toFixed(2)} {siteConfig.currency}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/commande"
              onClick={closeCart}
              className="block w-full rounded-full bg-black py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Finaliser la commande
            </Link>
            <Link
              to="/collection"
              onClick={closeCart}
              className="block w-full rounded-full border border-neutral-300 py-3 text-center text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
