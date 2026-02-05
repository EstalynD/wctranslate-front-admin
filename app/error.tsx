"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Algo salió mal
        </h1>
        <p className="text-slate-500 mb-6">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => window.location.href = "/dashboard"}>
            Ir al dashboard
          </Button>
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  )
}
