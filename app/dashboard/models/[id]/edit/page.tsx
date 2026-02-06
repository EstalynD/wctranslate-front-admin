"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ModelForm } from "@/components/dashboard/models"
import { ArrowLeft, UserPen, Loader2, AlertCircle } from "lucide-react"
import { usersService, type UserModel } from "@/lib/api"

/* ===== Page Component ===== */
export default function EditModelPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<UserModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del usuario al montar
  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await usersService.getById(userId)
        setUser(userData)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cargar el usuario"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const handleSubmit = (updatedUser: UserModel) => {
    // Redirigir al listado de usuarios
    router.push("/dashboard/models")
  }

  const handleCancel = () => {
    router.push("/dashboard/models")
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="h-20 flex items-center px-8 bg-transparent border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/models"
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                <UserPen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                  Editar Usuario
                </h2>
                <p className="text-xs text-slate-400 mt-1">Cargando datos...</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
        </div>
      </div>
    )
  }

  // Estado de error
  if (error || !user) {
    return (
      <div className="flex flex-col h-full">
        <header className="h-20 flex items-center px-8 bg-transparent border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/models"
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                  Error
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {error || "Usuario no encontrado"}
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
            <p className="text-slate-400">{error || "No se pudo cargar el usuario"}</p>
            <Link
              href="/dashboard/models"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all"
            >
              Volver al Listado
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const fullName = `${user.profile.firstName} ${user.profile.lastName}`

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
            <div className="size-10 rounded-xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
              <UserPen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                Editar Usuario
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Modificando: <span className="text-white font-medium">{fullName}</span>
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
              mode="edit"
              user={user}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>

          {/* Tips informativos */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-amber-600/5 border border-amber-600/10 rounded-xl">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-amber-400">Nota:</span> La contraseña solo se actualizará si ingresas una nueva.
                Deja los campos de contraseña vacíos para mantener la actual.
              </p>
            </div>
            <div className="p-4 bg-blue-600/5 border border-blue-600/10 rounded-xl">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-blue-400">Plataforma:</span> Si cambias la plataforma de streaming,
                se reasignarán los módulos específicos de la nueva plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
