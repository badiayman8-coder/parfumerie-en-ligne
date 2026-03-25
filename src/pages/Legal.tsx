import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'

export function Legal() {
  const cfg = siteConfig
  return (
    <div className="mx-auto max-w-2xl space-y-8 text-sm leading-relaxed text-neutral-700">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Infos, livraison & conditions
        </h1>
        <p className="mt-3">
          Ce site présente une liquidation de stock de flacons au format 33 ml. Les visuels
          type « revendeur » servent d&apos;illustration ; les photographies « stock »
          sur chaque fiche reflètent l&apos;emballage réel expédié.
        </p>
      </div>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">Commande & paiement</h2>
        <p className="mt-2">
          Aucun paiement en ligne n&apos;est proposé. Le règlement s&apos;effectue{' '}
          <strong>uniquement en espèces au moment de la livraison</strong>, contre
          remise du colis. En validant une commande via le formulaire (WhatsApp), vous
          acceptez ces conditions.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">Livraison & prix</h2>
        <p className="mt-2">
          {cfg.amana} Les délais et modalités (point relais, livraison à domicile)
          dépendent de votre ville : elles seront confirmées par message après commande.
        </p>
        <p className="mt-2">
          Le prix unitaire affiché ({cfg.unitPriceDh} {cfg.currency} le flacon){' '}
          <strong>inclut la livraison</strong> pour une commande hors offre pack. Les{' '}
          <Link to="/packs" className="font-medium underline underline-offset-2">
            packs 2 parfums ({cfg.pack2TotalDh} {cfg.currency}) et 3 parfums (
            {cfg.pack3TotalDh} {cfg.currency})
          </Link>{' '}
          s&apos;appliquent lorsque le panier contient exactement 2 ou 3 flacons et que
          vous cochez l&apos;offre correspondante — livraison incluse dans le montant pack.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">Stock & disponibilité</h2>
        <p className="mt-2">
          Les quantités sont limitées. Une référence peut s&apos;épuiser entre le moment
          de votre message et la confirmation — nous vous préviendrons en cas d&apos;indisponibilité.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">Contact</h2>
        <p className="mt-2">
          Commandes et questions : WhatsApp (numéro configuré dans le site) et Instagram{' '}
          <a
            href={cfg.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
          >
            @{cfg.instagramHandle}
          </a>
          . Email : {cfg.contactEmail} (à remplacer).
        </p>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
        <p className="font-medium text-neutral-800">Mise en garde</p>
        <p className="mt-2">
          La revente de produits de parfumerie est soumise à la réglementation locale. Le
          vendeur est seul responsable du respect des droits des marques et de l&apos;exactitude
          des informations produit. Ce texte est un modèle à valider avec un conseil adapté.
        </p>
      </section>
    </div>
  )
}
