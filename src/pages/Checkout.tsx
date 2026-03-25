import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { QuantityStepper } from '../components/QuantityStepper'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { cartTotalUnits, computeTotals } from '../lib/pricing'
import { whatsappOrderUrl } from '../lib/whatsapp'

export function Checkout() {
  const { products } = useProducts()
  const { lines, setQty, remove, packOffer } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  const units = cartTotalUnits(lines)
  const eligible2 = units === 2
  const eligible3 = units === 3

  const totals = useMemo(
    () => computeTotals(lines, products, packOffer),
    [lines, products, packOffer]
  )

  const canSubmit =
    lines.length > 0 &&
    name.trim().length > 2 &&
    phone.trim().length > 6 &&
    city.trim().length > 1 &&
    address.trim().length > 4

  const waUrl = canSubmit
    ? whatsappOrderUrl(lines, products, packOffer, {
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim(),
      })
    : '#'

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-semibold tracking-tight">Panier & commande</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Récapitulatif — paiement en espèces à la livraison. Aucune carte bancaire.
        </p>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-neutral-300 px-4 py-12 text-center text-sm text-neutral-500">
            Votre panier est vide.{' '}
            <Link to="/collection" className="font-medium text-neutral-900 underline">
              Parcourir la boutique
            </Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
            {lines.map((line) => {
              const p = products.find((x) => x.id === line.productId)
              if (!p) return null
              return (
                <li
                  key={line.productId}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      <img
                        src={p.imageOfficial}
                        alt={`${p.brand} ${p.name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-neutral-500">
                        {siteConfig.shopName}
                      </p>
                      <p className="font-semibold">
                        {p.brand} {p.name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {p.priceDh.toFixed(2)} {siteConfig.currency} / unité (livraison
                        incluse à l&apos;unité)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <QuantityStepper
                      value={line.qty}
                      onChange={(n) => setQty(line.productId, n)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(line.productId)}
                      className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                    >
                      Retirer
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {lines.length > 0 && (eligible2 || eligible3) ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
            <p className="text-sm font-semibold text-emerald-950">Tarif pack appliqué automatiquement</p>
            <p className="mt-2 text-sm text-emerald-900/90">
              {eligible2 ? (
                <>
                  {siteConfig.pack2Title} — <strong>{siteConfig.pack2TotalDh}</strong>{' '}
                  {siteConfig.currency} pour 2 flacons (mix homme/femme).
                </>
              ) : (
                <>
                  {siteConfig.pack3Title} — <strong>{siteConfig.pack3TotalDh}</strong>{' '}
                  {siteConfig.currency} pour 3 flacons (mix homme/femme).
                </>
              )}
            </p>
            <p className="mt-2 text-xs text-emerald-900/75">
              Dès que votre panier contient 2 ou 3 flacons au total, le total ci-contre utilise
              l&apos;offre pack (pas besoin de cocher une case).
            </p>
          </div>
        ) : null}
      </div>

      <aside className="lg:col-span-2">
        <div className="sticky top-24 space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Totaux
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt>Sous-total</dt>
              <dd className="tabular-nums">
                {totals.subtotalDh.toFixed(2)} {siteConfig.currency}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Livraison</dt>
              <dd className="tabular-nums">
                {totals.packApplied
                  ? 'Incluse (offre pack)'
                  : totals.deliveryDh === 0
                    ? 'Incluse au prix du flacon'
                    : `${totals.deliveryDh.toFixed(2)} ${siteConfig.currency}`}
              </dd>
            </div>
            {totals.packApplied ? (
              <div className="text-xs text-neutral-600">{totals.packLabel}</div>
            ) : null}
            <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3 text-base font-semibold">
              <dt>Total à payer à la livraison</dt>
              <dd className="tabular-nums">
                {totals.totalDh.toFixed(2)} {siteConfig.currency}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-neutral-500">
            Pas de paiement en ligne — confirmation par WhatsApp.
          </p>
        </div>

        <form
          className="mt-6 space-y-4 rounded-2xl border border-neutral-200 p-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="text-sm font-semibold text-neutral-900">Coordonnées de livraison</h2>
          <div>
            <label htmlFor="name" className="text-xs font-medium text-neutral-600">
              Nom complet
            </label>
            <input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-black focus:ring-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-xs font-medium text-neutral-600">
              Téléphone (WhatsApp)
            </label>
            <input
              id="phone"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-black focus:ring-2"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="text-xs font-medium text-neutral-600">
              Ville
            </label>
            <input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-black focus:ring-2"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="text-xs font-medium text-neutral-600">
              Adresse ou point relais Amana
            </label>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-black focus:ring-2"
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="text-xs font-medium text-neutral-600">
              Notes (optionnel)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none ring-black focus:ring-2"
            />
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className={`flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white ${
              canSubmit ? 'bg-emerald-600 hover:bg-emerald-700' : 'cursor-not-allowed bg-neutral-300'
            }`}
            aria-disabled={!canSubmit}
            onClick={(e) => {
              if (!canSubmit) e.preventDefault()
            }}
          >
            Envoyer la commande sur WhatsApp
          </a>
          {!canSubmit && lines.length > 0 ? (
            <p className="text-center text-xs text-neutral-500">
              Remplissez tous les champs pour activer l&apos;envoi.
            </p>
          ) : null}
        </form>
      </aside>
    </div>
  )
}
