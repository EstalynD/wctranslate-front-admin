import { apiConfig } from "./config"

// Key para almacenar el token en localStorage
const AUTH_TOKEN_KEY = "wc_admin_token"

/**
 * Error personalizado para la API
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`)
    this.name = "ApiError"
  }

  get message(): string {
    if (this.data && typeof this.data === "object" && "message" in this.data) {
      return String(this.data.message)
    }
    return `${this.status} ${this.statusText}`
  }
}

/**
 * Cliente HTTP para peticiones a la API
 * Soporta JSON y FormData (multipart/form-data)
 */
class HttpClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = apiConfig.baseUrl
  }

  /**
   * Obtiene el token de autenticación
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }

  /**
   * Guarda el token de autenticación
   */
  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }
  }

  /**
   * Elimina el token de autenticación
   */
  clearAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  /**
   * Realiza una petición HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getAuthToken()

    const headers: HeadersInit = { ...options.headers }

    // Agregar token de autorización si existe
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    // Solo agregar Content-Type si no es FormData
    // FormData establece su propio Content-Type con boundary
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)["Content-Type"] = "application/json"
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new ApiError(response.status, response.statusText, data)
    }

    // Manejar respuestas vacías
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return response.json()
    }

    return {} as T
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  /**
   * POST request con JSON
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * POST request con FormData (para subir archivos)
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
    })
  }

  /**
   * PUT request con JSON
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request con FormData (para subir archivos)
   */
  async putFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: formData,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

// Instancia singleton del cliente HTTP
export const httpClient = new HttpClient()
