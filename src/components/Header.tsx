import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { useCart } from '../hooks/useCart'
import { cartTotalUnits } from '../lib/pricing'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block rounded-lg px-3 py-2 text-sm font-medium',
    isActive ? 'bg-neutral-100 text-black' : 'text-neutral-600 hover:bg-neutral-50',
  ].join(' ')

export function Header() {
  const [open, setOpen] = useState(false)
  const { lines, openCart } = useCart()
  const count = cartTotalUnits(lines)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="rounded-lg p-2 text-neutral-800 hover:bg-neutral-100 lg:hidden"
          aria-expanded={open}
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((o) => !o)}
        >
          <MenuIcon />
        </button>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-semibold tracking-tight lg:static lg:translate-x-0"
          onClick={() => setOpen(false)}
        >
          <span className="text-lg uppercase">{siteConfig.shopName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" className={navClass} end>
            Accueil
          </NavLink>
          <NavLink to="/collection" className={navClass}>
            Boutique
          </NavLink>
          <NavLink to="/packs" className={navClass}>
            Packs
          </NavLink>
          <NavLink to="/mentions" className={navClass}>
            Infos
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-lg p-2 text-neutral-800 hover:bg-neutral-100"
            aria-label="Ouvrir ma commande"
          >
            <BagIcon />
            {count > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {count > 9 ? '9+' : count}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            <NavLink to="/" className={navClass} end>
              Accueil
            </NavLink>
            <NavLink to="/collection" className={navClass}>
              Boutique
            </NavLink>
            <NavLink to="/packs" className={navClass}>
              Packs
            </NavLink>
            <NavLink to="/mentions" className={navClass}>
              Infos & livraison
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7V6a6 6 0 1 1 12 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 7h14l-1 14H6L5 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
