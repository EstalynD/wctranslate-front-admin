"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ModelForm } from "@/components/dashboard/models"
import { ArrowLeft, UserPlus } from "lucide-react"
import type { UserModel } from "@/lib/api"

/* ===== Page Component ===== */
export default function NewModelPage() {
  const router = useRouter()

  const handleSubmit = (user: UserModel) => {
    // Redirigir al listado de usuarios
    router.push("/dashboard/models")
  }

  const handleCancel = () => {
    router.push("/dashboard/models")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/models"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
              <UserPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                Nuevo Usuario
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Crea una nueva cuenta de usuario en la plataforma
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        <div className="max-w-3xl mx-auto p-10">
          <div className="glass-effect rounded-2xl p-8 border-white/10">
            <ModelForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>

          {/* Tips informativos */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-blue-600/5 border border-blue-600/10 rounded-xl">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-blue-400">Plataforma:</span> Al asignar una plataforma de streaming,
                se asignarán automáticamente los módulos específicos de esa plataforma junto con los módulos generales.
                Si no se selecciona plataforma, solo se asignarán módulos generales.
              </p>
            </div>
            <div className="p-4 bg-amber-600/5 border border-amber-600/10 rounded-xl">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-amber-400">Roles:</span> Los usuarios con rol Administrador o Estudio
                son exclusivamente administrativos y no tienen acceso al sistema de gamificación ni a módulos de
                entrenamiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
