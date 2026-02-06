/**
 * Servicio de Lecciones (Lessons) para el panel de administración
 * Maneja operaciones CRUD para lecciones dentro de temas
 */

import { apiConfig } from "./config"
import { httpClient } from "./client"

/* ===== Enums ===== */

export enum LessonType {
  VIDEO = "VIDEO",
  EXERCISE = "EXERCISE",
  QUIZ = "QUIZ",
  READING = "READING",
  DOWNLOAD = "DOWNLOAD",
}

export enum LessonStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum BlockType {
  TEXT = "TEXT",
  VIDEO = "VIDEO",
  IFRAME = "IFRAME",
  FILE = "FILE",
  QUIZ = "QUIZ",
  CODE = "CODE",
  IMAGE = "IMAGE",
}

/* ===== Interfaces ===== */

/**
 * Configuración de bloque de contenido
 */
export interface BlockSettings {
  autoPlay?: boolean
  allowFullScreen?: boolean
  height?: string
  language?: string
  caption?: string
  fileName?: string
  fileSize?: string
}

/**
 * Bloque de contenido de una lección
 */
export interface ContentBlock {
  type: BlockType
  order: number
  content?: string
  mediaUrl?: string
  iframeSrc?: string
  settings?: BlockSettings
}

/**
 * Recurso descargable
 */
export interface LessonResource {
  id: string
  name: string
  type: "pdf" | "video" | "image" | "document" | "other"
  size: string
  url: string
}

/**
 * Configuración de entrega para ejercicios
 */
export interface SubmissionConfig {
  maxFileSize: string
  acceptedFormats: string[]
  requiresComment: boolean
}

/**
 * Resultado de subida de HTML a Cloudinary
 */
export interface HtmlUploadResult {
  url: string
  publicId: string
  bytes: number
  originalName: string
}

/**
 * Lección completa del API
 */
export interface Lesson {
  _id: string
  title: string
  slug: string
  description: string
  type: LessonType
  status: LessonStatus
  themeId: string
  contentBlocks: ContentBlock[]
  resources: LessonResource[]
  durationMinutes: number
  order: number
  requiresPreviousCompletion: boolean
  deadline: string | null
  submissionConfig: SubmissionConfig | null
  quizId: string | null
  isPreview: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Datos para crear una lección
 */
export interface CreateLessonData {
  title: string
  description?: string
  type: LessonType
  themeId: string
  contentBlocks?: ContentBlock[]
  resources?: LessonResource[]
  durationMinutes?: number
  order?: number
  requiresPreviousCompletion?: boolean
  deadline?: string | null
  submissionConfig?: SubmissionConfig | null
  quizId?: string | null
  isPreview?: boolean
  status?: LessonStatus
}

/**
 * Datos para actualizar una lección
 */
export interface UpdateLessonData {
  title?: string
  description?: string
  type?: LessonType
  contentBlocks?: ContentBlock[]
  resources?: LessonResource[]
  durationMinutes?: number
  order?: number
  requiresPreviousCompletion?: boolean
  deadline?: string | null
  submissionConfig?: SubmissionConfig | null
  quizId?: string | null
  isPreview?: boolean
  status?: LessonStatus
}

/* ===== Service ===== */

export const lessonsService = {
  /**
   * Obtiene todas las lecciones de un tema
   */
  async getByTheme(themeId: string): Promise<Lesson[]> {
    return httpClient.get<Lesson[]>(apiConfig.endpoints.lessons.list(themeId))
  },

  /**
   * Obtiene una lección por ID
   */
  async getById(id: string): Promise<Lesson> {
    return httpClient.get<Lesson>(apiConfig.endpoints.lessons.detail(id))
  },

  /**
   * Crea una nueva lección
   */
  async create(data: CreateLessonData): Promise<Lesson> {
    return httpClient.post<Lesson>("/lessons", data)
  },

  /**
   * Actualiza una lección
   */
  async update(id: string, data: UpdateLessonData): Promise<Lesson> {
    return httpClient.put<Lesson>(apiConfig.endpoints.lessons.detail(id), data)
  },

  /**
   * Elimina una lección
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete(apiConfig.endpoints.lessons.detail(id))
  },

  /**
   * Actualiza el estado de una lección
   */
  async updateStatus(id: string, status: LessonStatus): Promise<Lesson> {
    return httpClient.put<Lesson>(apiConfig.endpoints.lessons.detail(id), {
      status,
    })
  },

  /**
   * Duplica una lección en el mismo tema
   */
  async duplicate(id: string): Promise<Lesson> {
    return httpClient.post<Lesson>(`/lessons/${id}/duplicate`)
  },

  // ==================== CONTENT BLOCKS ====================

  /**
   * Agrega un bloque de contenido a la lección
   */
  async addContentBlock(id: string, block: Omit<ContentBlock, "order">): Promise<Lesson> {
    return httpClient.post<Lesson>(apiConfig.endpoints.lessons.blocks(id), block)
  },

  /**
   * Actualiza un bloque de contenido por índice
   */
  async updateContentBlock(
    id: string,
    index: number,
    block: Partial<ContentBlock>
  ): Promise<Lesson> {
    return httpClient.put<Lesson>(
      apiConfig.endpoints.lessons.blockByIndex(id, index),
      block
    )
  },

  /**
   * Elimina un bloque de contenido por índice
   */
  async removeContentBlock(id: string, index: number): Promise<Lesson> {
    return httpClient.delete(apiConfig.endpoints.lessons.blockByIndex(id, index))
  },

  /**
   * Reordena los bloques de contenido
   */
  async reorderContentBlocks(id: string, newOrder: number[]): Promise<Lesson> {
    return httpClient.put<Lesson>(apiConfig.endpoints.lessons.reorderBlocks(id), {
      newOrder,
    })
  },

  // ==================== RESOURCES ====================

  /**
   * Agrega un recurso descargable a la lección
   */
  async addResource(id: string, resource: Omit<LessonResource, "id">): Promise<Lesson> {
    return httpClient.post<Lesson>(apiConfig.endpoints.lessons.resources(id), resource)
  },

  /**
   * Elimina un recurso de la lección
   */
  async removeResource(id: string, resourceId: string): Promise<Lesson> {
    return httpClient.delete(
      apiConfig.endpoints.lessons.resourceById(id, resourceId)
    )
  },

  // ==================== HTML UPLOAD ====================

  /**
   * Sube un archivo HTML a Cloudinary
   */
  async uploadHtml(file: File, folder?: string): Promise<HtmlUploadResult> {
    const formData = new FormData()
    formData.append("file", file)
    if (folder) formData.append("folder", folder)

    return httpClient.postFormData<HtmlUploadResult>(
      apiConfig.endpoints.lessons.uploadHtml,
      formData
    )
  },

  /**
   * Actualiza un HTML en Cloudinary (elimina anterior, sube nuevo)
   */
  async updateHtml(file: File, oldUrl: string, folder?: string): Promise<HtmlUploadResult> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("oldUrl", oldUrl)
    if (folder) formData.append("folder", folder)

    return httpClient.putFormData<HtmlUploadResult>(
      apiConfig.endpoints.lessons.uploadHtml,
      formData
    )
  },

  /**
   * Elimina un HTML de Cloudinary
   */
  async deleteHtml(url: string): Promise<{ deleted: boolean; publicId: string }> {
    return httpClient.post<{ deleted: boolean; publicId: string }>(
      apiConfig.endpoints.lessons.deleteHtml,
      { url }
    )
  },
}

/* ===== Utils ===== */

/**
 * Labels para los tipos de lección
 */
export const lessonTypeLabels: Record<LessonType, string> = {
  [LessonType.VIDEO]: "Video",
  [LessonType.EXERCISE]: "Ejercicio",
  [LessonType.QUIZ]: "Quiz",
  [LessonType.READING]: "Lectura",
  [LessonType.DOWNLOAD]: "Descarga",
}

/**
 * Labels para los estados
 */
export const lessonStatusLabels: Record<LessonStatus, string> = {
  [LessonStatus.DRAFT]: "Borrador",
  [LessonStatus.PUBLISHED]: "Publicado",
}

/**
 * Iconos sugeridos para tipos de lección (nombres de Lucide)
 */
export const lessonTypeIcons: Record<LessonType, string> = {
  [LessonType.VIDEO]: "Play",
  [LessonType.EXERCISE]: "Upload",
  [LessonType.QUIZ]: "HelpCircle",
  [LessonType.READING]: "BookOpen",
  [LessonType.DOWNLOAD]: "Download",
}

/**
 * Genera un slug para la lección
 */
export function generateLessonSlug(title: string, themeSlug?: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return themeSlug ? `${themeSlug}-${baseSlug}` : baseSlug
}

/**
 * Formatea la duración en minutos a formato legible
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Verifica si una lección tiene contenido
 */
export function hasContent(lesson: Lesson): boolean {
  return lesson.contentBlocks.length > 0 || lesson.resources.length > 0
}
