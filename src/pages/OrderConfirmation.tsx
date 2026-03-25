import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { useProducts } from '../hooks/useProducts'
import { catalogHasMixedUnitPrices, formatUnitDh } from '../lib/catalogPricing'
import { getLastOrderRef, loadConfirmedOrder, type StoredOrderPayload } from '../lib/orderStorage'
import { computeTotals } from '../lib/pricing'

function formatFrenchDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function OrderConfirmation() {
  const { products } = useProducts()
  const [params] = useSearchParams()
  const refParam = params.get('ref')
  const [copyOk, setCopyOk] = useState(false)

  const payload = useMemo((): StoredOrderPayload | null => {
    const r = refParam || getLastOrderRef()
    if (!r) return null
    return loadConfirmedOrder(r)
  }, [refParam])

  const totals = useMemo(() => {
    if (!payload) return null
    return computeTotals(payload.lines, products, payload.packOffer)
  }, [payload, products])

  const showUnit = useMemo(() => {
    if (!payload || !totals) return false
    return catalogHasMixedUnitPrices(products) && !totals.packApplied
  }, [payload, products, totals])

  const copyRef = useCallback(() => {
    if (!payload) return
    void navigator.clipboard.writeText(payload.orderRef).then(() => {
      setCopyOk(true)
      setTimeout(() => setCopyOk(false), 2000)
    })
  }, [payload])

  const printTicket = useCallback(() => {
    window.print()
  }, [])

  if (!payload) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-semibold">Ticket introuvable</h1>
        <p className="mt-3 text-sm text-neutral-600">
          Ce lien de confirmation n&apos;est plus valide ou la session a expiré. Passez une
          nouvelle commande depuis la boutique.
        </p>
        <Link
          to="/collection"
          className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white"
        >
          Retour à la boutique
        </Link>
      </div>
    )
  }

  if (!totals) {
    return null
  }

  const { customer } = payload

  return (
    <div className="mx-auto max-w-lg space-y-8 pb-12 print:max-w-none print:pb-0">
      <div className="no-print text-center">
        <p className="text-sm font-medium text-emerald-700">Commande enregistrée</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Votre ticket</h1>
        <p className="mt-2 text-sm text-neutral-600">
          WhatsApp devrait s&apos;être ouvert avec le même numéro de commande. Conservez ce
          ticket (client + livreur).
        </p>
      </div>

      <article
        className="ticket-print rounded-2xl border-2 border-dashed border-neutral-400 bg-white p-6 shadow-lg print:border-neutral-900 print:shadow-none"
        id="order-ticket"
      >
        <header className="border-b border-neutral-200 pb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            {siteConfig.shopName}
          </p>
          <p className="mt-3 font-mono text-3xl font-bold tracking-wider text-neutral-900">
            {payload.orderRef}
          </p>
          <p className="mt-2 text-xs text-neutral-500">{formatFrenchDate(payload.createdAt)}</p>
        </header>

        <section className="mt-4 space-y-2 border-b border-neutral-100 pb-4 text-sm">
          <p className="font-semibold text-neutral-900">Livraison</p>
          <p>
            <span className="text-neutral-500">Nom : </span>
            {customer.name}
          </p>
          <p>
            <span className="text-neutral-500">Tél. : </span>
            {customer.phone}
          </p>
          <p>
            <span className="text-neutral-500">Ville : </span>
            {customer.city}
          </p>
          <p>
            <span className="text-neutral-500">Adresse : </span>
            {customer.address}
          </p>
          {customer.notes ? (
            <p>
              <span className="text-neutral-500">Notes : </span>
              {customer.notes}
            </p>
          ) : null}
        </section>

        <section className="mt-4 text-sm">
          <p className="font-semibold text-neutral-900">Articles</p>
          <ul className="mt-2 space-y-2">
            {payload.lines.map((line) => {
              const p = products.find((x) => x.id === line.productId)
              if (!p) return null
              return (
                <li key={line.productId} className="flex justify-between gap-2">
                  <span>
                    {p.brand} {p.name} × {line.qty}
                  </span>
                  {showUnit ? (
                    <span className="shrink-0 tabular-nums text-neutral-600">
                      {formatUnitDh(p.priceDh)}/u
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-4 border-t border-neutral-200 pt-4 text-sm">
          {totals.packApplied ? (
            <p className="text-neutral-600">{totals.packLabel}</p>
          ) : null}
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Total à payer à la livraison</span>
            <span className="tabular-nums">
              {totals.totalDh.toFixed(2)} {siteConfig.currency}
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">Paiement en espèces uniquement.</p>
        </section>

        <div className="mt-6 grid gap-3 border-t border-neutral-200 pt-4 sm:grid-cols-2">
          <div className="rounded-xl bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-800">
            <p className="font-semibold text-neutral-900">Pour le client</p>
            <p className="mt-1">
              Conservez ce numéro <strong className="font-mono">{payload.orderRef}</strong> pour
              toute question. Présentez-le au livreur si besoin.
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-950">
            <p className="font-semibold">Pour le livreur</p>
            <p className="mt-1">
              Vérifier la référence <strong className="font-mono">{payload.orderRef}</strong> et
              le montant <strong>{totals.totalDh.toFixed(2)} {siteConfig.currency}</strong> avant
              remise du colis.
            </p>
          </div>
        </div>
      </article>

      <div className="no-print flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={copyRef}
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
        >
          {copyOk ? 'Copié !' : 'Copier le N° de commande'}
        </button>
        <button
          type="button"
          onClick={printTicket}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Imprimer le ticket
        </button>
        <Link
          to="/"
          className="rounded-full border border-neutral-300 px-5 py-2.5 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
