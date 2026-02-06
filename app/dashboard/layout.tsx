"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { authService, type User } from "@/lib/api"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
      window.location.href = "/login"
      return
    }

    const storedUser = authService.getStoredUser()
    if (!storedUser || storedUser.role !== "ADMIN") {
      authService.logout()
      window.location.href = "/login"
      return
    }

    setUser(storedUser)
    setIsReady(true)
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

  const displayName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email ?? "Admin"

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar
        user={{
          name: displayName,
          role: user?.role === "ADMIN" ? "Administrador" : user?.role ?? "",
        }}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
