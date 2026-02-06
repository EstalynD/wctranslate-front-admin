import { httpClient, ApiError } from "./client"
import { apiConfig } from "./config"

/* ===== Types ===== */
export interface User {
  _id: string
  email: string
  role: "USER" | "ADMIN"
  status: string
  profile: {
    firstName: string
    lastName: string
    nickName?: string
    avatar?: string
  }
  subscription?: {
    plan: string
    status: string
  }
}

export interface LoginResponse {
  message: string
  user: User
  token: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/* ===== Auth Service ===== */
export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      apiConfig.endpoints.auth.login,
      credentials
    )

    // Guardar token automáticamente
    httpClient.setAuthToken(response.token)

    // Guardar datos del usuario
    if (typeof window !== "undefined") {
      localStorage.setItem("wc_admin_user", JSON.stringify(response.user))
    }

    return response
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(apiConfig.endpoints.auth.logout)
    } catch {
      // Ignorar errores al cerrar sesión
    } finally {
      // Limpiar datos locales siempre
      httpClient.clearAuthToken()
      if (typeof window !== "undefined") {
        localStorage.removeItem("wc_admin_user")
      }
    }
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>(apiConfig.endpoints.auth.me)
  },

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("wc_admin_token")
  },

  /**
   * Obtener usuario guardado localmente
   */
  getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem("wc_admin_user")
    return data ? JSON.parse(data) : null
  },

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    const user = this.getStoredUser()
    return user?.role === "ADMIN"
  },
}
