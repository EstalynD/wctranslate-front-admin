"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"

interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Verificar autenticación UNA SOLA VEZ
    const token = localStorage.getItem("admin_token")
    const storedUser = localStorage.getItem("admin_user")

    if (!token || !storedUser) {
      // No autenticado, redirigir
      window.location.href = "/login"
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsReady(true)
    } catch {
      window.location.href = "/login"
    }
  }, [])

  // Mostrar loading mientras verifica
  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 mt-4">Cargando panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar
        user={user ? {
          name: user.name,
          role: user.role === "super_admin" ? "Super Admin" : user.role,
        } : undefined}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
