import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { consumeOpenCartDrawer } from '../lib/packComposer'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { StickyCartBar } from './StickyCartBar'

export function Layout() {
  const { openCart, lines } = useCart()
  const location = useLocation()

  useEffect(() => {
    if (consumeOpenCartDrawer()) openCart()
  }, [location.pathname, location.search, openCart])

  const hasItems = lines.length > 0

  return (
    <div className="flex min-h-dvh flex-col bg-white font-sans text-neutral-900">
      <Header />
      <main
        className={
          hasItems
            ? 'mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-4 sm:px-6'
            : 'mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-4 sm:px-6'
        }
      >
        <Outlet />
      </main>
      <Footer />
      <StickyCartBar />
      <CartDrawer />
    </div>
  )
}
