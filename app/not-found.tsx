import Link from "next/link"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-6xl font-bold text-slate-200 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Página no encontrada
        </h2>
        <p className="text-slate-500 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
