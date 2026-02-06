"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
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
  ChevronRight,
  Layers,
  Check,
} from "lucide-react"
import { coursesService, lessonsService, LessonType, lessonTypeLabels } from "@/lib/api"
import type { CourseWithThemes, Theme as ThemeAPI, Lesson } from "@/lib/api"

/* ===== Types ===== */
const lessonTypeIcons: Record<LessonType, typeof BookOpen> = {
  [LessonType.VIDEO]: Play,
  [LessonType.READING]: BookOpen,
  [LessonType.QUIZ]: HelpCircle,
  [LessonType.EXERCISE]: Upload,
  [LessonType.DOWNLOAD]: Download,
}

const lessonTypeColors: Record<LessonType, string> = {
  [LessonType.VIDEO]: "text-red-400",
  [LessonType.READING]: "text-emerald-400",
  [LessonType.QUIZ]: "text-amber-400",
  [LessonType.EXERCISE]: "text-blue-400",
  [LessonType.DOWNLOAD]: "text-purple-400",
}

interface ThemeWithLessons extends ThemeAPI {
  lessonsData: Lesson[]
}

/* ===== Page Component ===== */
export default function CoursePreviewPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<CourseWithThemes | null>(null)
  const [themesWithLessons, setThemesWithLessons] = useState<ThemeWithLessons[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCourse = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const courseData = await coursesService.getWithThemes(courseId)
      setCourse(courseData)

      // Cargar lecciones de cada tema
      if (courseData.themes && courseData.themes.length > 0) {
        const themesData = await Promise.all(
          courseData.themes.map(async (theme: ThemeAPI) => {
            let lessons: Lesson[] = []
            try {
              lessons = await lessonsService.getByTheme(theme._id)
            } catch {
              console.warn(`No se pudieron cargar lecciones del tema ${theme._id}`)
            }
            return {
              ...theme,
              lessonsData: [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            }
          })
        )
        // Ordenar temas por su campo order
        setThemesWithLessons(
          [...themesData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        )
      }
    } catch (err) {
      console.error("Error cargando curso:", err)
      setError(err instanceof Error ? err.message : "Error al cargar el curso")
    } finally {
      setIsLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId, loadCourse])

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando vista previa del módulo...</p>
        </div>
      </div>
    )
  }

  // Error
  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#0b0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 rounded-full bg-red-500/10 mx-auto mb-4 w-fit">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-400 mb-4">{error || "Módulo no encontrado"}</p>
          <button
            onClick={loadCourse}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const totalLessons = themesWithLessons.reduce((acc, t) => acc + t.lessonsData.length, 0)
  const totalDuration = themesWithLessons.reduce(
    (acc, t) => acc + t.lessonsData.reduce((a, l) => a + l.durationMinutes, 0),
    0
  )

  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white">
      {/* Admin Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/modules"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Vista Previa del Módulo</p>
              <p className="font-bold truncate max-w-[300px]">{course.title}</p>
            </div>
          </div>
          <Link
            href={`/dashboard/modules/${course._id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Módulo
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />

        <div className="relative px-4 md:px-6 lg:px-8 py-12 max-w-6xl mx-auto">
          {/* Thumbnail */}
          {course.thumbnail && (
            <div className="mb-8 rounded-2xl overflow-hidden max-w-md">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {course.title}
          </h1>

          {/* Description */}
          {course.description && (
            <p className="text-slate-300 text-lg max-w-3xl mb-6">
              {course.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>{themesWithLessons.length} Temas</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>{totalLessons} Lecciones</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Themes & Lessons */}
      <main className="bg-[#15132d] rounded-t-3xl min-h-[60vh] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold mb-8">Contenido del Módulo</h2>

          {themesWithLessons.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Este módulo no tiene temas aún</p>
            </div>
          ) : (
            <div className="space-y-6">
              {themesWithLessons.map((theme, themeIndex) => (
                <div
                  key={theme._id}
                  className="rounded-2xl border border-white/10 overflow-hidden bg-white/5"
                >
                  {/* Theme Header */}
                  <div className="px-6 py-5 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">
                        {themeIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{theme.title}</h3>
                        {theme.description && (
                          <p className="text-sm text-slate-400 mt-1">{theme.description}</p>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        {theme.lessonsData.length} lecciones
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {theme.lessonsData.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {theme.lessonsData.map((lesson, lessonIndex) => {
                        const TypeIcon = lessonTypeIcons[lesson.type] || BookOpen
                        const typeColor = lessonTypeColors[lesson.type] || lessonTypeColors[LessonType.READING]

                        return (
                          <Link
                            key={lesson._id}
                            href={`/preview/lesson/${lesson._id}`}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors group"
                          >
                            <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 text-sm font-medium">
                              {lessonIndex + 1}
                            </div>
                            <TypeIcon className={`w-5 h-5 ${typeColor}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate group-hover:text-blue-400 transition-colors">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-slate-500">
                                {lessonTypeLabels[lesson.type]} · {lesson.durationMinutes} min
                              </p>
                            </div>
                            {lesson.isPreview && (
                              <span className="px-2 py-1 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 uppercase">
                                Preview
                              </span>
                            )}
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center text-slate-500">
                      No hay lecciones en este tema
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer spacer */}
      <div className="h-20 bg-[#15132d]" />
    </div>
  )
}
