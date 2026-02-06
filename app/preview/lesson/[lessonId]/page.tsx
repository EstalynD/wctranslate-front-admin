"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ContentBlockRenderer } from "@/components/dashboard/lessons"
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Play,
  HelpCircle,
  Upload,
  Download,
  Loader2,
  AlertTriangle,
  Edit,
} from "lucide-react"
import { lessonsService, themesService, LessonType, lessonTypeLabels } from "@/lib/api"
import type { Lesson, LessonResource, Theme as ThemeAPI } from "@/lib/api"

/* ===== Types ===== */
const lessonTypeIcons: Record<LessonType, typeof BookOpen> = {
  [LessonType.VIDEO]: Play,
  [LessonType.READING]: BookOpen,
  [LessonType.QUIZ]: HelpCircle,
  [LessonType.EXERCISE]: Upload,
  [LessonType.DOWNLOAD]: Download,
}

const lessonTypeColors: Record<LessonType, string> = {
  [LessonType.VIDEO]: "bg-red-500/10 text-red-400",
  [LessonType.READING]: "bg-emerald-500/10 text-emerald-400",
  [LessonType.QUIZ]: "bg-amber-500/10 text-amber-400",
  [LessonType.EXERCISE]: "bg-blue-500/10 text-blue-400",
  [LessonType.DOWNLOAD]: "bg-purple-500/10 text-purple-400",
}

/* ===== Page Component ===== */
export default function LessonPreviewPage() {
  const params = useParams()
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [courseId, setCourseId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLesson = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await lessonsService.getById(lessonId)
      setLesson(data)

      // Cargar el tema para obtener el courseId
      if (data.themeId) {
        try {
          const theme = await themesService.getById(data.themeId)
          setCourseId(theme.courseId)
        } catch (themeErr) {
          console.warn("No se pudo cargar el tema:", themeErr)
        }
      }
    } catch (err) {
      console.error("Error cargando lección:", err)
      setError(err instanceof Error ? err.message : "Error al cargar la lección")
    } finally {
      setIsLoading(false)
    }
  }, [lessonId])

  useEffect(() => {
    if (lessonId) {
      loadLesson()
    }
  }, [lessonId, loadLesson])

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando vista previa...</p>
        </div>
      </div>
    )
  }

  // Error
  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-[#0b0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 rounded-full bg-red-500/10 mx-auto mb-4 w-fit">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-400 mb-4">{error || "Lección no encontrada"}</p>
          <button
            onClick={loadLesson}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const TypeIcon = lessonTypeIcons[lesson.type] || BookOpen
  const typeColor = lessonTypeColors[lesson.type] || lessonTypeColors[LessonType.READING]

  // URLs de navegación según si tenemos courseId
  const moduleUrl = courseId
    ? `/dashboard/modules/${courseId}`
    : "/dashboard/modules"
  const editUrl = courseId
    ? `/dashboard/modules/${courseId}/lesson/${lesson._id}`
    : `/dashboard/modules`

  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white">
      {/* Admin Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={moduleUrl}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Vista Previa</p>
              <p className="font-bold truncate max-w-[300px]">{lesson.title}</p>
            </div>
          </div>
          <Link
            href={editUrl}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Lección
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${typeColor}`}>
            <TypeIcon className="size-3.5" />
            {lessonTypeLabels[lesson.type]}
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1.5">
            <Clock className="size-4" />
            {lesson.durationMinutes} min
          </span>
          {lesson.isPreview && (
            <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase">
              Vista Previa Pública
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
          {lesson.title}
        </h1>

        {/* Description */}
        {lesson.description && (
          <p className="text-slate-400 text-lg max-w-3xl">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Content */}
      <main className="bg-[#15132d] rounded-t-3xl md:rounded-3xl md:mx-4 lg:mx-6 xl:mx-auto xl:max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/5 border-b-0 md:border-b min-h-[60vh]">
        {/* Content Blocks */}
        <ContentBlockRenderer blocks={lesson.contentBlocks} />

        {/* Resources Section */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              Recursos Descargables
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.resources.map((resource: LessonResource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="size-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Download className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{resource.name}</p>
                    <p className="text-sm text-slate-400">{resource.size}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer spacer */}
      <div className="h-20" />
    </div>
  )
}
