# Parfumerie en ligne — liquidation 33 ml

Site vitrine **statique** (Vite + React + TypeScript + Tailwind) : catalogue, fiches produit, panier, commande par **WhatsApp**, paiement **en espèces à la livraison**.

## Prérequis

- Node.js 20+

## Développement local

```bash
npm install
npm run dev
```

Ouvrir l’URL affichée (souvent `http://localhost:5173`).

## Build production

```bash
npm run build
npm run preview
```

Le dossier `dist/` contient les fichiers à publier.

## Configuration à personnaliser

| Fichier | Rôle |
|--------|------|
| [`src/config/site.ts`](src/config/site.ts) | Nom boutique, **WhatsApp**, Instagram, **130 dh** unité (livraison incluse), totaux **pack 2** / **pack 3** (`pack2TotalDh`, `pack3TotalDh`), texte bannière |
| [`src/data/products.json`](src/data/products.json) | Catalogue : `id`, `brand`, `name`, `priceDh` (130), `volumeMl`, URLs `imageOfficial` / `imageStock` |

Remplacez les URLs Unsplash par des chemins locaux une fois vos fichiers dans `public/` (ex. `"imageOfficial": "/images/products/prada-official.jpg"`).

### Administration des photos (`/admin`)

- Page **[Admin photos](http://localhost:5173/admin)** (lien aussi en bas de page) : modifier les **URLs** des images revendeur / stock ; enregistrement dans le **navigateur** (localStorage).
- Bouton **Télécharger products.json (fusionné)** pour réinjecter le fichier dans le dépôt avant mise en ligne.
- Optionnel : définir **`VITE_ADMIN_PIN`** dans un fichier `.env` puis `npm run build` pour exiger un code à l’entrée (le code est toutefois embarqué côté client — usage de praticité, pas de sécurité forte).

## Déploiement (HTTPS)

- **Netlify** : connecter le dépôt Git ou glisser-déposer `dist`. Le fichier [`netlify.toml`](netlify.toml) configure le build et le routage SPA.
- **Vercel** : importer le projet ; [`vercel.json`](vercel.json) redirige vers `index.html` pour le routeur React.
- **Autre hébergeur statique** : servir `dist` et configurer une **fallback** vers `index.html` pour toutes les routes (sinon `/produit/...` renverra 404).

## Instagram (bio & messages)

Texte type pour la bio (à adapter avec le **lien réel** du site et le handle) :

> Flacons **33 ml** — liquidation stock. Paiement **à la livraison** (espèces). Envoi **Amana**. Commandes : lien en bio.

Stories / posts : réutiliser les mêmes visuels que le site ; lien direct vers `/produit/[id]` ou `/packs`.

## Tests manuels du parcours

1. Ajouter un produit au panier, vérifier le compteur header.
2. Panier : 2 flacons → cocher l’offre pack → total **120 dh**, livraison « Incluse ».
3. Remplir le formulaire → « Envoyer sur WhatsApp » ouvre une conversation avec le texte prérempli (numéro à configurer dans `site.ts`).

---

Projet initial généré pour une campagne de liquidation ; les données sont dans le dépôt pour mise à jour sans backend.
