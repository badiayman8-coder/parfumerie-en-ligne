import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-4xl font-semibold text-neutral-300">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page introuvable</h1>
      <Link to="/" className="mt-6 inline-block text-sm font-medium underline">
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
