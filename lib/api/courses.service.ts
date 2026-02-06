import { httpClient } from "./client"
import { apiConfig } from "./config"

/* ===== Enums ===== */
export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum CourseLevel {
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum CourseCategory {
  MARKETING = "MARKETING",
  TECHNICAL = "TECHNICAL",
  PSYCHOLOGY = "PSYCHOLOGY",
  LEGAL = "LEGAL",
  STYLING = "STYLING",
  COMMUNICATION = "COMMUNICATION",
}

export enum PlanType {
  FREE = "FREE",
  BASIC = "BASIC",
  PRO = "PRO",
  ELITE = "ELITE",
}

/* ===== Types ===== */
export interface Course {
  _id: string
  title: string
  slug: string
  description: string
  thumbnail: string | null
  category: CourseCategory
  level: CourseLevel
  status: CourseStatus
  isFeatured: boolean
  allowedPlans: PlanType[]
  themes: string[]
  totalDurationMinutes: number
  totalLessons: number
  enrolledCount: number
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface Theme {
  _id: string
  courseId: string
  title: string
  slug: string
  description: string
  highlightedText: string | null
  order: number
  lessons: string[]
  totalDurationMinutes: number
  totalLessons: number
  requiresPreviousCompletion: boolean
  unlockThreshold: number
  createdAt: string
  updatedAt: string
}

export interface CourseWithThemes extends Omit<Course, "themes"> {
  themes: Theme[]
}

export interface CreateCourseData {
  title: string
  slug: string
  description?: string
  category: CourseCategory
  level?: CourseLevel
  status?: CourseStatus
  isFeatured?: boolean
  allowedPlans?: PlanType[]
  displayOrder?: number
}

export interface UpdateCourseData {
  title?: string
  description?: string
  thumbnail?: string | null
  category?: CourseCategory
  level?: CourseLevel
  status?: CourseStatus
  isFeatured?: boolean
  allowedPlans?: PlanType[]
  displayOrder?: number
}

export interface QueryCoursesParams {
  status?: CourseStatus
  category?: CourseCategory
  level?: CourseLevel
  plan?: PlanType
  isFeatured?: boolean
  page?: number
  limit?: number
}

export interface PaginatedCourses {
  courses: Course[]
  total: number
  page: number
  totalPages: number
}

/* ===== Courses Service ===== */
export const coursesService = {
  /**
   * Obtiene todos los cursos con paginación y filtros
   */
  async getAll(params?: QueryCoursesParams): Promise<PaginatedCourses> {
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
      ? `${apiConfig.endpoints.courses.list}?${query}`
      : apiConfig.endpoints.courses.list

    return httpClient.get<PaginatedCourses>(endpoint)
  },

  /**
   * Obtiene un curso por ID
   */
  async getById(id: string): Promise<Course> {
    return httpClient.get<Course>(apiConfig.endpoints.courses.detail(id))
  },

  /**
   * Obtiene un curso por slug
   */
  async getBySlug(slug: string): Promise<Course> {
    return httpClient.get<Course>(apiConfig.endpoints.courses.bySlug(slug))
  },

  /**
   * Obtiene un curso con sus temas
   */
  async getWithThemes(id: string): Promise<CourseWithThemes> {
    return httpClient.get<CourseWithThemes>(
      apiConfig.endpoints.courses.withThemes(id)
    )
  },

  /**
   * Crea un nuevo curso (sin imagen)
   */
  async create(data: CreateCourseData): Promise<Course> {
    return httpClient.post<Course>(apiConfig.endpoints.courses.list, data)
  },

  /**
   * Crea un nuevo curso con imagen opcional
   */
  async createWithImage(
    data: CreateCourseData,
    thumbnailFile?: File
  ): Promise<Course> {
    const formData = new FormData()

    // Agregar todos los campos del data al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Para arrays como allowedPlans
          value.forEach((item) => formData.append(key, String(item)))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    // Agregar archivo si existe
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile)
    }

    return httpClient.postFormData<Course>(
      apiConfig.endpoints.courses.list,
      formData
    )
  },

  /**
   * Actualiza un curso (sin imagen)
   */
  async update(id: string, data: UpdateCourseData): Promise<Course> {
    return httpClient.put<Course>(apiConfig.endpoints.courses.detail(id), data)
  },

  /**
   * Actualiza un curso con imagen opcional
   */
  async updateWithImage(
    id: string,
    data: UpdateCourseData,
    thumbnailFile?: File
  ): Promise<Course> {
    const formData = new FormData()

    // Agregar todos los campos del data al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, String(item)))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    // Agregar archivo si existe
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile)
    }

    return httpClient.putFormData<Course>(
      apiConfig.endpoints.courses.detail(id),
      formData
    )
  },

  /**
   * Elimina un curso
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete(apiConfig.endpoints.courses.detail(id))
  },

  /**
   * Reordena los temas de un curso
   */
  async reorderThemes(id: string, themeIds: string[]): Promise<Course> {
    return httpClient.put<Course>(apiConfig.endpoints.courses.reorderThemes(id), {
      themeIds,
    })
  },

  /**
   * Actualiza las estadísticas de un curso
   */
  async updateStats(id: string): Promise<{ success: boolean }> {
    return httpClient.post<{ success: boolean }>(
      apiConfig.endpoints.courses.updateStats(id)
    )
  },
}

/* ===== Utils ===== */

/**
 * Genera un slug a partir del título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/-+/g, "-") // Múltiples guiones a uno
    .replace(/^-|-$/g, "") // Eliminar guiones al inicio y final
}

/**
 * Labels para los niveles
 */
export const levelLabels: Record<CourseLevel, string> = {
  [CourseLevel.BASIC]: "Básico",
  [CourseLevel.INTERMEDIATE]: "Intermedio",
  [CourseLevel.ADVANCED]: "Avanzado",
}

/**
 * Labels para las categorías
 */
export const categoryLabels: Record<CourseCategory, string> = {
  [CourseCategory.MARKETING]: "Marketing",
  [CourseCategory.TECHNICAL]: "Técnico",
  [CourseCategory.PSYCHOLOGY]: "Psicología",
  [CourseCategory.LEGAL]: "Legal",
  [CourseCategory.STYLING]: "Estilismo",
  [CourseCategory.COMMUNICATION]: "Comunicación",
}

/**
 * Labels para los estados
 */
export const statusLabels: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]: "Borrador",
  [CourseStatus.PUBLISHED]: "Publicado",
  [CourseStatus.ARCHIVED]: "Archivado",
}

/**
 * Labels para los planes
 */
export const planLabels: Record<PlanType, string> = {
  [PlanType.FREE]: "Gratis",
  [PlanType.BASIC]: "Básico",
  [PlanType.PRO]: "Pro",
  [PlanType.ELITE]: "Elite",
}
