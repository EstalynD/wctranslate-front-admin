"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle } from "lucide-react"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

// Credenciales de prueba
const TEST_CREDENTIALS = {
  email: "admin@wctraining.test",
  password: "Admin1234",
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay
    await new Promise((r) => setTimeout(r, 500))

    if (
      email.trim().toLowerCase() === TEST_CREDENTIALS.email &&
      password === TEST_CREDENTIALS.password
    ) {
      // Guardar sesión
      localStorage.setItem("admin_token", "demo-admin-token-123")
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          id: 1,
          email: TEST_CREDENTIALS.email,
          name: "Administrador",
          role: "super_admin",
        })
      )

      // Redirigir al dashboard
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas")
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen relative ${inter.variable}`}>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.15),_transparent_55%)]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-xl text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div className="leading-tight">
            <span className="text-white text-lg font-semibold tracking-tight">
              WC TRAINING
            </span>
            <span className="block text-blue-400 text-[10px] font-medium tracking-widest">
              ADMIN PANEL
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-white text-2xl md:text-3xl font-semibold">
              Acceso Administrativo
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Control y gestión de la plataforma
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-white text-lg font-semibold">
                  Iniciar sesión
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Ingresa tus credenciales de administrador
                </p>
              </div>
              <Lock className="w-6 h-6 text-blue-500/60" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-slate-400 text-[11px] font-bold tracking-wider uppercase ml-1">
                  Correo administrativo
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@wctraining.com"
                    required
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 pr-11 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-500 disabled:opacity-50"
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-slate-400 text-[11px] font-bold tracking-wider uppercase ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 pr-11 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-500 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-blue-600/30 mt-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verificando..." : "Iniciar sesión"}
              </button>

              {/* Info */}
              <div className="text-center text-slate-500 text-xs pt-2">
                Conexión segura. Acceso restringido a personal autorizado.
              </div>
            </form>
          </div>

          {/* Test Credentials Info */}
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Credenciales de prueba:</p>
            <p className="text-slate-300 text-xs">Email: admin@wctraining.test</p>
            <p className="text-slate-300 text-xs">Password: Admin1234</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-white/50 text-[9px] font-bold uppercase tracking-[0.25em]">
          WC TRAINING ADMIN • 2026
        </p>
      </footer>
    </div>
  )
}
