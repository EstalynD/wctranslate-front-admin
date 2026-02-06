"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { PlatformForm } from "@/components/dashboard/platforms"
import { ArrowLeft, Globe } from "lucide-react"
import type { Platform } from "@/lib/api"

/* ===== Page Component ===== */
export default function NewPlatformPage() {
  const router = useRouter()

  const handleSubmit = (platform: Platform) => {
    // Redirigir al listado de plataformas
    router.push("/dashboard/platforms")
  }

  const handleCancel = () => {
    router.push("/dashboard/platforms")
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
                Nueva Plataforma
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Agrega una nueva plataforma de streaming
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
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-600/5 border border-blue-600/10 rounded-xl">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-blue-400">Tip:</span> El favicon se usa para identificar
              rápidamente la plataforma en listas y menús. El logo se muestra en la tarjeta de la plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
