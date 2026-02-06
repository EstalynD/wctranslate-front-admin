import { httpClient } from "./client"
import { apiConfig } from "./config"

/* ===== Enums ===== */
export enum PlatformStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum PlatformType {
  TOKENS_CAM = "TOKENS_CAM",
  PRIVATE = "PRIVATE",
  CONTENT = "CONTENT",
}

/* ===== Types ===== */
export interface Platform {
  _id: string
  name: string
  slug: string
  type: PlatformType
  description: string
  favicon: string | null
  logoUrl: string | null
  websiteUrl: string | null
  status: PlatformStatus
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreatePlatformData {
  name: string
  type: PlatformType
  description?: string
  favicon?: string
  websiteUrl?: string
  status?: PlatformStatus
  displayOrder?: number
}

export interface UpdatePlatformData {
  name?: string
  type?: PlatformType
  description?: string
  favicon?: string
  websiteUrl?: string
  status?: PlatformStatus
  displayOrder?: number
}

export interface QueryPlatformsParams {
  status?: PlatformStatus
  type?: PlatformType
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedPlatforms {
  data: Platform[]
  total: number
  page: number
  totalPages: number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  total?: number
  page?: number
  totalPages?: number
}

/* ===== Endpoints de Plataformas ===== */
const platformsEndpoints = {
  list: "/platforms",
  active: "/platforms/active",
  detail: (id: string) => `/platforms/${id}`,
  toggleStatus: (id: string) => `/platforms/${id}/toggle-status`,
}

/* ===== Platforms Service ===== */
export const platformsService = {
  /**
   * Obtiene todas las plataformas con paginación y filtros
   */
  async getAll(params?: QueryPlatformsParams): Promise<PaginatedPlatforms> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    const endpoint = query
      ? `${platformsEndpoints.list}?${query}`
      : platformsEndpoints.list

    const response = await httpClient.get<ApiResponse<Platform[]>>(endpoint)

    return {
      data: response.data,
      total: response.total ?? 0,
      page: response.page ?? 1,
      totalPages: response.totalPages ?? 1,
    }
  },

  /**
   * Obtiene solo las plataformas activas
   */
  async getActive(): Promise<Platform[]> {
    return httpClient.get<Platform[]>(platformsEndpoints.active)
  },

  /**
   * Obtiene una plataforma por ID
   */
  async getById(id: string): Promise<Platform> {
    const response = await httpClient.get<ApiResponse<Platform>>(
      platformsEndpoints.detail(id)
    )
    return response.data
  },

  /**
   * Crea una nueva plataforma (sin imágenes)
   */
  async create(data: CreatePlatformData): Promise<Platform> {
    const response = await httpClient.post<ApiResponse<Platform>>(
      platformsEndpoints.list,
      data
    )
    return response.data
  },

  /**
   * Crea una nueva plataforma con favicon y logo opcionales
   */
  async createWithImages(
    data: CreatePlatformData,
    faviconFile?: File,
    logoFile?: File
  ): Promise<Platform> {
    const formData = new FormData()

    // Agregar todos los campos del data al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    // Agregar archivos si existen
    if (faviconFile) {
      formData.append("favicon", faviconFile)
    }
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    return httpClient.postFormData<Platform>(platformsEndpoints.list, formData)
  },

  /**
   * Actualiza una plataforma (sin imágenes)
   */
  async update(id: string, data: UpdatePlatformData): Promise<Platform> {
    const response = await httpClient.put<ApiResponse<Platform>>(
      platformsEndpoints.detail(id),
      data
    )
    return response.data
  },

  /**
   * Actualiza una plataforma con favicon y logo opcionales
   */
  async updateWithImages(
    id: string,
    data: UpdatePlatformData,
    faviconFile?: File,
    logoFile?: File
  ): Promise<Platform> {
    const formData = new FormData()

    // Agregar todos los campos del data al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    // Agregar archivos si existen
    if (faviconFile) {
      formData.append("favicon", faviconFile)
    }
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    return httpClient.putFormData<Platform>(
      platformsEndpoints.detail(id),
      formData
    )
  },

  /**
   * Elimina una plataforma
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete(platformsEndpoints.detail(id))
  },

  /**
   * Cambia el estado de una plataforma (toggle)
   */
  async toggleStatus(id: string): Promise<Platform> {
    const response = await httpClient.patch<ApiResponse<Platform>>(
      platformsEndpoints.toggleStatus(id)
    )
    return response.data
  },
}

/* ===== Utils ===== */

/**
 * Genera un slug a partir del nombre
 */
export function generatePlatformSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .replace(/^-|-$/g, "") // Eliminar guiones al inicio y final
}

/**
 * Labels para los estados de plataforma
 */
export const platformStatusLabels: Record<PlatformStatus, string> = {
  [PlatformStatus.ACTIVE]: "Activa",
  [PlatformStatus.INACTIVE]: "Inactiva",
}

/**
 * Labels para tipos de plataforma
 */
export const platformTypeLabels: Record<PlatformType, string> = {
  [PlatformType.TOKENS_CAM]: "Tokens/Cam",
  [PlatformType.PRIVATE]: "Privadas",
  [PlatformType.CONTENT]: "Contenido",
}
