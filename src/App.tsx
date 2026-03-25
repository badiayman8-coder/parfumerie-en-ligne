import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartProvider'
import { ProductsProvider } from './context/ProductsProvider'
import { Layout } from './components/Layout'
import { Admin } from './pages/Admin'
import { Checkout } from './pages/Checkout'
import { Collection } from './pages/Collection'
import { Home } from './pages/Home'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'
import { Packs } from './pages/Packs'
import { ProductDetail } from './pages/ProductDetail'

export default function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="collection" element={<Collection />} />
              <Route path="produit/:id" element={<ProductDetail />} />
              <Route path="packs" element={<Packs />} />
              <Route path="mentions" element={<Legal />} />
              <Route path="commande" element={<Checkout />} />
              <Route path="admin" element={<Admin />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  )
}
