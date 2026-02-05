"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ModuleForm } from "@/components/dashboard/modules"
import { ArrowLeft, Blocks } from "lucide-react"

/* ===== Types ===== */
interface ModuleFormData {
  title: string
  description: string
  image?: string
  coverColor: string
  status: "draft" | "published"
  requiredLevel: "silver" | "gold" | "diamond"
  estimatedDuration: number
}

/* ===== Page Component ===== */
export default function NewModulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: ModuleFormData) => {
    setIsLoading(true)

    try {
      // TODO: Implementar llamada a API para crear módulo
      console.log("Creating module:", data)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generar ID temporal (en producción vendría del backend)
      const newModuleId = `MOD-${Date.now()}`

      // Redirigir al editor del nuevo módulo
      router.push(`/dashboard/modules/${newModuleId}`)
    } catch (error) {
      console.error("Error creating module:", error)
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/modules")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/modules"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
              <Blocks className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                Crear Nuevo Módulo
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configura los detalles básicos de tu módulo de formación
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        <div className="max-w-3xl mx-auto p-10">
          <div className="glass-effect rounded-2xl p-8 border-white/10">
            <ModuleForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-600/5 border border-blue-600/10 rounded-xl">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-blue-400">Tip:</span> Después de crear el módulo,
              podrás añadir temas y tareas desde el editor. Los cambios se guardarán automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
