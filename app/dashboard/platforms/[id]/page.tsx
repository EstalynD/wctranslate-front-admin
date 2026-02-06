"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { PlatformForm } from "@/components/dashboard/platforms"
import { ArrowLeft, Globe, Loader2, AlertCircle } from "lucide-react"
import { platformsService, type Platform } from "@/lib/api"

/* ===== Page Component ===== */
export default function EditPlatformPage() {
  const params = useParams()
  const id = typeof params?.id === "string" ? params.id : ""
  const router = useRouter()
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setError("ID de plataforma inválido")
      return
    }

    const loadPlatform = async () => {
      try {
        const data = await platformsService.getById(id)
        setPlatform(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cargar la plataforma"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlatform()
  }, [id])

  const handleSubmit = (updatedPlatform: Platform) => {
    // Redirigir al listado de plataformas
    router.push("/dashboard/platforms")
  }

  const handleCancel = () => {
    router.push("/dashboard/platforms")
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400">Cargando plataforma...</p>
      </div>
    )
  }

  // Error State
  if (error || !platform) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error al cargar</h2>
          <p className="text-slate-400 mb-6">{error || "No se encontró la plataforma"}</p>
          <Link
            href="/dashboard/platforms"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/platforms"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                Editar Plataforma
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {platform.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        <div className="max-w-3xl mx-auto p-10">
          <div className="glass-effect rounded-2xl p-8 border-white/10">
            <PlatformForm
              platformId={id}
              initialData={{
                name: platform.name,
                description: platform.description,
                websiteUrl: platform.websiteUrl ?? "",
                type: platform.type,
                status: platform.status,
                favicon: platform.favicon ?? undefined,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
