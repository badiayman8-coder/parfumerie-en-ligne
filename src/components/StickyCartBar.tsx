import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { getPackFlow } from '../lib/packComposer'
import { cartTotalUnits, computeTotals } from '../lib/pricing'

export function StickyCartBar() {
  const { products } = useProducts()
  const { lines, drawerOpen, openCart, packOffer } = useCart()

  if (lines.length === 0 || drawerOpen) return null

  const units = cartTotalUnits(lines)
  const totals = computeTotals(lines, products, packOffer)
  const flow = getPackFlow()
  const packRemaining =
    flow && units < flow.target ? flow.target - units : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-neutral-900">
            Ma commande · {units} article{units > 1 ? 's' : ''}
          </p>
          <p className="truncate text-xs text-neutral-600">
            Total{' '}
            <span className="font-semibold tabular-nums text-neutral-900">
              {totals.totalDh.toFixed(2)} {siteConfig.currency}
            </span>
            {totals.packApplied ? (
              <span className="ml-2 text-emerald-700">({totals.packLabel})</span>
            ) : null}
          </p>
          {packRemaining > 0 ? (
            <p className="mt-1 text-xs font-medium text-emerald-800">
              Encore {packRemaining} parfum{packRemaining > 1 ? 's' : ''} à choisir (boutique)
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={openCart}
            className="flex-1 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 sm:flex-none"
          >
            Voir le détail
          </button>
          <Link
            to="/commande"
            className="flex flex-1 items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 sm:flex-none"
          >
            Commander
          </Link>
        </div>
      </div>
    </div>
  )
}
