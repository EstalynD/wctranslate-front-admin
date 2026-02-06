"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  LessonHeaderEditor,
  ContentBlockEditor,
  ResourcesEditor,
} from "@/components/dashboard/lessons"
import type { LessonHeaderData } from "@/components/dashboard/lessons"
import {
  ArrowLeft,
  Eye,
  Save,
  Loader2,
  AlertTriangle,
  Trash2,
  Send,
} from "lucide-react"
import {
  lessonsService,
  LessonType,
  LessonStatus,
} from "@/lib/api"
import type { Lesson, ContentBlock, LessonResource } from "@/lib/api"

/* ===== Page Component ===== */
export default function LessonEditorPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const moduleId = params.moduleId as string
  const lessonId = params.lessonId as string
  const isNew = lessonId === "new"

  // Parámetros para crear nueva lección
  const themeId = searchParams.get("themeId") || ""
  const lessonType = (searchParams.get("type") || "reading").toUpperCase() as LessonType

  // Estados
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [headerData, setHeaderData] = useState<LessonHeaderData>({
    title: "",
    description: "",
    type: LessonType.READING,
    status: LessonStatus.DRAFT,
    durationMinutes: 0,
    isPreview: false,
  })
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [resources, setResources] = useState<LessonResource[]>([])
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Cargar datos de la lección existente
  const loadLessonData = useCallback(async () => {
    if (isNew) return

    try {
      setIsLoading(true)
      setError(null)

      const lessonData = await lessonsService.getById(lessonId)
      setLesson(lessonData)

      // Poblar estados
      setHeaderData({
        title: lessonData.title,
        description: lessonData.description,
        type: lessonData.type,
        status: lessonData.status,
        durationMinutes: lessonData.durationMinutes,
        isPreview: lessonData.isPreview,
      })
      setContentBlocks(lessonData.contentBlocks || [])
      setResources(lessonData.resources || [])
    } catch (err) {
      console.error("Error cargando lección:", err)
      setError(
        err instanceof Error ? err.message : "Error al cargar la lección"
      )
    } finally {
      setIsLoading(false)
    }
  }, [lessonId, isNew])

  useEffect(() => {
    if (!isNew) {
      loadLessonData()
    } else {
      // Inicializar con valores por defecto para nueva lección
      setHeaderData({
        title: "",
        description: "",
        type: lessonType in LessonType ? lessonType : LessonType.READING,
        status: LessonStatus.DRAFT,
        durationMinutes: 0,
        isPreview: false,
      })
    }
  }, [lessonId, isNew, lessonType, loadLessonData])

  // Marcar cambios
  const handleHeaderChange = (data: Partial<LessonHeaderData>) => {
    setHeaderData((prev) => ({ ...prev, ...data }))
    setHasChanges(true)
  }

  const handleContentBlocksChange = (blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
    setHasChanges(true)
  }

  const handleResourcesChange = (newResources: LessonResource[]) => {
    setResources(newResources)
    setHasChanges(true)
  }

  // Guardar lección
  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (isNew) {
        // Crear nueva lección
        if (!themeId) {
          throw new Error("Se requiere un tema para crear la lección")
        }

        const newLesson = await lessonsService.create({
          title: headerData.title || "Nueva Lección",
          description: headerData.description,
          type: headerData.type,
          themeId,
          contentBlocks,
          resources,
          durationMinutes: headerData.durationMinutes,
          isPreview: headerData.isPreview,
          status: headerData.status,
        })

        setLesson(newLesson)
        setHasChanges(false)

        // Redirigir a la URL con el ID real
        router.replace(
          `/dashboard/modules/${moduleId}/lesson/${newLesson._id}`
        )
      } else {
        // Actualizar lección existente
        const updatedLesson = await lessonsService.update(lessonId, {
          title: headerData.title,
          description: headerData.description,
          type: headerData.type,
          contentBlocks,
          resources,
          durationMinutes: headerData.durationMinutes,
          isPreview: headerData.isPreview,
          status: headerData.status,
        })

        setLesson(updatedLesson)
        setHasChanges(false)
      }
    } catch (err) {
      console.error("Error guardando lección:", err)
      setError(
        err instanceof Error ? err.message : "Error al guardar la lección"
      )
    } finally {
      setIsSaving(false)
    }
  }

  // Publicar lección
  const handlePublish = async () => {
    if (isNew) {
      // Primero guardar y luego publicar
      setHeaderData((prev) => ({ ...prev, status: LessonStatus.PUBLISHED }))
    }

    try {
      setIsSaving(true)

      if (isNew) {
        await handleSave()
      } else {
        await lessonsService.updateStatus(lessonId, LessonStatus.PUBLISHED)
        setHeaderData((prev) => ({ ...prev, status: LessonStatus.PUBLISHED }))
      }
    } catch (err) {
      console.error("Error publicando lección:", err)
    } finally {
      setIsSaving(false)
    }
  }

  // Eliminar lección
  const handleDelete = async () => {
    if (!lesson || isNew) return

    const confirmed = window.confirm(
      "¿Estás seguro de eliminar esta lección? Esta acción no se puede deshacer."
    )
    if (!confirmed) return

    try {
      await lessonsService.delete(lessonId)
      router.push(`/dashboard/modules/${moduleId}`)
    } catch (err) {
      console.error("Error eliminando lección:", err)
      setError(
        err instanceof Error ? err.message : "Error al eliminar la lección"
      )
    }
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-slate-400">Cargando lección...</p>
      </div>
    )
  }

  // Estado de error
  if (error && !isNew) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="p-4 rounded-full bg-red-500/10">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-400 text-center max-w-md">{error}</p>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/modules/${moduleId}`}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Volver al módulo
          </Link>
          <button
            onClick={loadLessonData}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/modules/${moduleId}`}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
              {isNew ? "Nueva Lección" : headerData.title || "Sin título"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {contentBlocks.length} bloques de contenido · {resources.length} recursos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de cambios */}
          {hasChanges && (
            <span className="text-xs text-amber-400 font-medium">
              Cambios sin guardar
            </span>
          )}

          {/* Botón eliminar (solo si no es nuevo) */}
          {!isNew && (
            <button
              onClick={handleDelete}
              className="p-2.5 hover:bg-red-600/20 border border-white/10 text-red-400 rounded-lg transition-all"
              title="Eliminar lección"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {/* Vista previa */}
          <button
            onClick={() => {
              if (lesson?._id) {
                window.open(`/preview/lesson/${lesson._id}`, "_blank")
              }
            }}
            disabled={isNew}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-5 h-5" />
            Vista Previa
          </button>

          {/* Guardar */}
          <button
            onClick={handleSave}
            disabled={isSaving || (!hasChanges && !isNew)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isNew ? "Crear" : "Guardar"}
          </button>

          {/* Publicar */}
          <button
            onClick={handlePublish}
            disabled={isSaving || headerData.status === LessonStatus.PUBLISHED}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-600/30"
          >
            <Send className="w-5 h-5" />
            {headerData.status === LessonStatus.PUBLISHED
              ? "Publicado"
              : "Publicar"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-10">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Lesson Header Info */}
          <LessonHeaderEditor data={headerData} onChange={handleHeaderChange} />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Content Blocks */}
          <ContentBlockEditor
            blocks={contentBlocks}
            onChange={handleContentBlocksChange}
          />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Resources */}
          <ResourcesEditor
            resources={resources}
            onChange={handleResourcesChange}
          />

          {/* Spacer */}
          <div className="h-20" />
        </div>
      </div>

      {/* Autosave Indicator */}
      <div className="fixed bottom-24 left-4 w-56">
        <div className="glass-effect rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
            Editor de Lección
          </p>
          <div className="flex justify-center items-center gap-1">
            {hasChanges ? (
              <>
                <span className="size-2 rounded-full bg-amber-500" />
                <p className="text-[10px] text-amber-500 font-bold">
                  Cambios pendientes
                </p>
              </>
            ) : (
              <>
                <span className="size-2 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-emerald-500 font-bold">
                  Todo guardado
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
