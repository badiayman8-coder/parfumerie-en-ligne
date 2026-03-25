import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { siteConfig } from '../config/site'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col">
      <Link
        to={`/produit/${product.id}`}
        className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
      >
        <div className="aspect-square overflow-hidden bg-neutral-100">
          <img
            src={product.imageOfficial}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-4 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {siteConfig.shopName}
          </p>
          <h2 className="mt-1 line-clamp-2 text-sm font-semibold uppercase tracking-tight text-neutral-900">
            {product.brand} {product.name}
          </h2>
          <p className="mt-2 text-sm font-medium">
            {product.priceDh.toFixed(2)} {siteConfig.currency}
          </p>
          {product.promoBadge ? (
            <span className="mt-2 inline-block rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              {product.promoBadge}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
