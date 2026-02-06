/**
 * Servicio de Temas (Themes) para el panel de administración
 * Maneja operaciones CRUD para temas dentro de cursos
 */

import { apiConfig } from "./config"
import { httpClient } from "./client"

/* ===== Enums ===== */

// No hay enums específicos para Theme en el backend

/* ===== Interfaces ===== */

/**
 * Lección básica para listados
 */
export interface LessonBasic {
  _id: string
  title: string
  slug: string
  type: "VIDEO" | "EXERCISE" | "QUIZ" | "READING" | "DOWNLOAD"
  status: "DRAFT" | "PUBLISHED"
  durationMinutes: number
  order: number
  isPreview: boolean
}

/**
 * Tema del API
 */
export interface Theme {
  _id: string
  title: string
  slug: string
  description: string
  highlightedText: string | null
  courseId: string
  lessons: string[] | LessonBasic[]
  order: number
  totalDurationMinutes: number
  totalLessons: number
  requiresPreviousCompletion: boolean
  unlockThreshold: number
  createdAt: string
  updatedAt: string
}

/**
 * Tema con lecciones pobladas
 */
export interface ThemeWithLessons extends Omit<Theme, "lessons"> {
  lessons: LessonBasic[]
}

/**
 * Datos para crear un tema
 */
export interface CreateThemeData {
  title: string
  description?: string
  highlightedText?: string | null
  courseId: string
  order?: number
  requiresPreviousCompletion?: boolean
  unlockThreshold?: number
}

/**
 * Datos para actualizar un tema
 */
export interface UpdateThemeData {
  title?: string
  description?: string
  highlightedText?: string | null
  order?: number
  requiresPreviousCompletion?: boolean
  unlockThreshold?: number
}

/* ===== Service ===== */

export const themesService = {
  /**
   * Obtiene todos los temas de un curso
   */
  async getByCourse(courseId: string): Promise<Theme[]> {
    return httpClient.get<Theme[]>(apiConfig.endpoints.themes.list(courseId))
  },

  /**
   * Obtiene un tema por ID
   */
  async getById(id: string): Promise<Theme> {
    return httpClient.get<Theme>(apiConfig.endpoints.themes.detail(id))
  },

  /**
   * Obtiene un tema con sus lecciones pobladas
   */
  async getWithLessons(id: string): Promise<ThemeWithLessons> {
    return httpClient.get<ThemeWithLessons>(
      `${apiConfig.endpoints.themes.detail(id)}?populate=lessons`
    )
  },

  /**
   * Crea un nuevo tema
   */
  async create(data: CreateThemeData): Promise<Theme> {
    return httpClient.post<Theme>("/themes", data)
  },

  /**
   * Actualiza un tema
   */
  async update(id: string, data: UpdateThemeData): Promise<Theme> {
    return httpClient.put<Theme>(apiConfig.endpoints.themes.detail(id), data)
  },

  /**
   * Elimina un tema
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete(apiConfig.endpoints.themes.detail(id))
  },

  /**
   * Reordena las lecciones de un tema
   */
  async reorderLessons(id: string, lessonIds: string[]): Promise<Theme> {
    return httpClient.put<Theme>(apiConfig.endpoints.themes.reorderLessons(id), {
      lessonIds,
    })
  },
}

/* ===== Utils ===== */

/**
 * Genera un slug a partir del título del tema
 */
export function generateThemeSlug(title: string, courseSlug?: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return courseSlug ? `${courseSlug}-${baseSlug}` : baseSlug
}

/**
 * Calcula la duración total de un tema basado en sus lecciones
 */
export function calculateThemeDuration(lessons: LessonBasic[]): number {
  return lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0)
}
