import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'

export function Packs() {
  const cfg = siteConfig
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Packs & livraison
        </h1>
        <p className="mt-3 text-neutral-600">
          Le prix du flacon à l&apos;unité <strong>inclut déjà la livraison</strong> (flacons
          standard ou premium). Les <strong>packs de 2 ou 3 parfums</strong> sont les mêmes
          pour toutes les références : dès que votre panier contient exactement 2 ou 3
          flacons, le <strong>tarif pack s&apos;applique automatiquement</strong> (mix
          homme/femme, standard ou premium).
        </p>
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold">{cfg.pack2Title}</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums">
          {cfg.pack2TotalDh} {cfg.currency}{' '}
          <span className="text-base font-normal text-neutral-600">
            (livraison incluse dans l&apos;offre)
          </span>
        </p>
        <p className="mt-4 text-sm text-neutral-700">
          Panier à <strong>exactement 2</strong> flacons — mélange homme/femme autorisé.
        </p>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold">{cfg.pack3Title}</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums">
          {cfg.pack3TotalDh} {cfg.currency}{' '}
          <span className="text-base font-normal text-neutral-600">
            (livraison incluse dans l&apos;offre)
          </span>
        </p>
        <p className="mt-4 text-sm text-neutral-700">
          Panier à <strong>exactement 3</strong> flacons — mélange homme/femme autorisé.
        </p>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-semibold">Doublons repérés dans la liste fournie</p>
        <ul className="mt-3 list-inside list-disc space-y-2">
          <li>
            <strong>Hermès</strong> : « Twilly d&apos;Hermès » et une entrée Hermès plus
            générique — même maison ; à fusionner si une seule référence en stock.
          </li>
          <li>
            <strong>Giorgio Armani</strong> : « Sì » et « Stronger With You » sont deux
            lignes différentes (pas un doublon de nom, mais même groupe).
          </li>
          <li>
            <strong>Lacoste</strong> : deux références distinctes (réf. 1 et réf. 2) comme
            demandé.
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
        <p className="font-semibold text-neutral-900">Promotions ponctuelles</p>
        <p className="mt-2">
          Les codes promo et opérations spéciales pourront être ajoutés ici ou dans la
          bannière d&apos;accueil (texte dans la configuration du site).
        </p>
      </section>

      <Link
        to="/collection"
        className="inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Composer mon pack
      </Link>
    </div>
  )
}
