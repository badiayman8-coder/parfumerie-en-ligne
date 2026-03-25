import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types/product'

export function Admin() {
  const { products, resetImageOverrides, exportProductsJson, overrides } = useProducts()

  const pinEnv = import.meta.env.VITE_ADMIN_PIN
  const [pinInput, setPinInput] = useState('')
  const [unlocked, setUnlocked] = useState(() => !pinEnv)

  const okPin = useMemo(() => {
    if (!pinEnv) return true
    return pinInput === pinEnv
  }, [pinEnv, pinInput])

  if (!unlocked && pinEnv) {
    return (
      <div className="mx-auto max-w-sm space-y-6 px-4 py-16">
        <h1 className="text-xl font-semibold">Administration</h1>
        <p className="text-sm text-neutral-600">
          Saisissez le code défini dans la variable d&apos;environnement{' '}
          <code className="rounded bg-neutral-100 px-1">VITE_ADMIN_PIN</code> au build.
        </p>
        <input
          type="password"
          autoComplete="off"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          placeholder="Code"
        />
        <button
          type="button"
          onClick={() => okPin && setUnlocked(true)}
          disabled={!okPin}
          className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Accéder
        </button>
        <Link to="/" className="block text-center text-sm text-neutral-500 underline">
          Retour au site
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Photos produits</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Modifiez les URLs des visuels (revendeur / stock). Les changements sont
            enregistrés dans ce navigateur (
            <strong>localStorage</strong>) — utilisez « Exporter JSON » pour mettre à jour
            le fichier <code className="rounded bg-neutral-100 px-1">products.json</code>{' '}
            dans le projet avant déploiement.
          </p>
        </div>
        <Link to="/" className="text-sm font-medium text-neutral-600 underline">
          Retour boutique
        </Link>
      </div>

      {!pinEnv ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Aucun <code className="rounded bg-amber-100 px-1">VITE_ADMIN_PIN</code> : cette
          page est accessible sans code. Pour la production, définissez un code et
          rebuild.
        </p>
      ) : null}

      {Object.keys(overrides).length > 0 ? (
        <p className="text-xs text-neutral-500">
          {Object.keys(overrides).length} produit(s) avec personnalisation locale active.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => exportProductsJson()}
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Télécharger products.json (fusionné)
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Réinitialiser toutes les photos personnalisées sur ce navigateur ?')) {
              resetImageOverrides()
            }
          }}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold"
        >
          Réinitialiser les personnalisations
        </button>
      </div>

      <div className="space-y-8">
        {products.map((p) => (
          <AdminProductRow
            key={`${p.id}-${p.imageOfficial}-${p.imageStock ?? ''}`}
            product={p}
          />
        ))}
      </div>
    </div>
  )
}

function AdminProductRow({ product: p }: { product: Product }) {
  const { setProductImages } = useProducts()
  const [official, setOfficial] = useState(p.imageOfficial)
  const [stock, setStock] = useState(p.imageStock ?? '')

  return (
    <article className="rounded-xl border border-neutral-200 p-4">
      <h2 className="font-semibold text-neutral-900">
        {p.brand} · {p.name}
      </h2>
      <p className="text-xs text-neutral-500">id : {p.id}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs">
          <span className="font-medium text-neutral-700">Image « revendeur » (URL)</span>
          <input
            value={official}
            onChange={(e) => setOfficial(e.target.value)}
            className="mt-1 w-full rounded border border-neutral-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="font-medium text-neutral-700">Image « stock » (URL)</span>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded border border-neutral-200 px-2 py-1.5 text-sm"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setProductImages(p.id, {
              imageOfficial: official,
              imageStock: stock || undefined,
            })
          }}
          className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white"
        >
          Enregistrer pour ce produit
        </button>
        <a
          href={official}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-500 underline"
        >
          Prévisualiser revendeur
        </a>
      </div>
    </article>
  )
}
