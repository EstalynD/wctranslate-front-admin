"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import {
  ModuleStructureSidebar,
  TaskTypeCards,
  ThemeEditor,
  AddTasksSection,
} from "@/components/dashboard/modules"
import type { ThemeData } from "@/components/dashboard/modules/theme-editor"
import { ArrowLeft, Eye, Send, Loader2, AlertTriangle } from "lucide-react"
import {
  coursesService,
  themesService,
  lessonsService,
  LessonType,
  CourseStatus,
} from "@/lib/api"
import type {
  CourseWithThemes,
  Theme as ThemeAPI,
  Lesson,
} from "@/lib/api"

/* ===== Types para Componentes UI ===== */
type TaskType = "video" | "quiz" | "reading" | "upload"

interface Task {
  id: string
  title: string
  type: TaskType
}

interface ThemeUI {
  id: string
  title: string
  description: string
  highlightedText: string
  durationMinutes: number
  requiresPreviousCompletion: boolean
  unlockThreshold: number
  order: number
  tasks: Task[]
}

/* ===== Mappers ===== */

/**
 * Mapea el tipo de lección del backend al tipo de tarea del UI
 */
function mapLessonTypeToTaskType(type: LessonType): TaskType {
  const typeMap: Record<LessonType, TaskType> = {
    [LessonType.VIDEO]: "video",
    [LessonType.QUIZ]: "quiz",
    [LessonType.READING]: "reading",
    [LessonType.EXERCISE]: "upload",
    [LessonType.DOWNLOAD]: "reading",
  }
  return typeMap[type] || "reading"
}

/* ===== Page Component ===== */
export default function ModuleEditorPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string

  // Estados
  const [course, setCourse] = useState<CourseWithThemes | null>(null)
  const [themes, setThemes] = useState<ThemeUI[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<string>("")
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del curso y temas
  const loadCourseData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Cargar curso con temas
      const courseData = await coursesService.getWithThemes(moduleId)
      setCourse(courseData)

      // Si hay temas, cargar las lecciones de cada tema
      if (courseData.themes && courseData.themes.length > 0) {
        const themesWithLessons = await Promise.all(
          courseData.themes.map(async (theme: ThemeAPI) => {
            // Cargar lecciones del tema
            let lessons: Lesson[] = []
            try {
              lessons = await lessonsService.getByTheme(theme._id)
            } catch {
              // Si falla, continuar sin lecciones
              console.warn(`No se pudieron cargar lecciones del tema ${theme._id}`)
            }

            // Ordenar lecciones por order
            const sortedLessons = [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

            // Mapear a formato UI
            const themeUI: ThemeUI = {
              id: theme._id,
              title: theme.title,
              description: theme.description || "",
              highlightedText: theme.highlightedText || "",
              durationMinutes: theme.totalDurationMinutes || 0,
              requiresPreviousCompletion: theme.requiresPreviousCompletion ?? true,
              unlockThreshold: theme.unlockThreshold ?? 100,
              order: theme.order,
              tasks: sortedLessons.map((lesson) => ({
                id: lesson._id,
                title: lesson.title,
                type: mapLessonTypeToTaskType(lesson.type),
              })),
            }
            return themeUI
          })
        )

        // Ordenar temas por su campo order
        const sortedThemes = themesWithLessons.sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )

        setThemes(sortedThemes)

        // Seleccionar el primer tema por defecto
        if (themesWithLessons.length > 0) {
          setSelectedThemeId(themesWithLessons[0].id)
          if (themesWithLessons[0].tasks.length > 0) {
            setSelectedTaskId(themesWithLessons[0].tasks[0].id)
          }
        }
      }
    } catch (err) {
      console.error("Error cargando datos del módulo:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los datos del módulo"
      )
    } finally {
      setIsLoading(false)
    }
  }, [moduleId])

  useEffect(() => {
    if (moduleId) {
      loadCourseData()
    }
  }, [moduleId, loadCourseData])

  const selectedTheme = themes.find((t) => t.id === selectedThemeId)

  const handleThemeChange = async (updatedTheme: ThemeData) => {
    if (!selectedThemeId) return

    try {
      setIsSaving(true)
      await themesService.update(selectedThemeId, {
        title: updatedTheme.title,
        description: updatedTheme.description,
        highlightedText: updatedTheme.highlightedText || null,
        requiresPreviousCompletion: updatedTheme.requiresPreviousCompletion,
        unlockThreshold: updatedTheme.unlockThreshold,
      })

      // Actualizar estado local
      setThemes((prev) =>
        prev.map((t) =>
          t.id === selectedThemeId
            ? {
                ...t,
                title: updatedTheme.title,
                description: updatedTheme.description,
                highlightedText: updatedTheme.highlightedText,
                requiresPreviousCompletion: updatedTheme.requiresPreviousCompletion,
                unlockThreshold: updatedTheme.unlockThreshold,
              }
            : t
        )
      )
    } catch (err) {
      console.error("Error actualizando tema:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTheme = async (themeId?: string) => {
    const targetId = themeId || selectedThemeId
    if (!targetId) return

    try {
      await themesService.delete(targetId)

      setThemes((prev) => {
        const filtered = prev.filter((t) => t.id !== targetId)
        // Si eliminamos el tema seleccionado, seleccionar otro
        if (selectedThemeId === targetId) {
          const nextTheme = filtered[0]
          setSelectedThemeId(nextTheme?.id || "")
          setSelectedTaskId(nextTheme?.tasks?.[0]?.id || "")
        }
        return filtered
      })
    } catch (err) {
      console.error("Error eliminando tema:", err)
    }
  }

  const handleDeleteTask = async (themeId: string, taskId: string) => {
    try {
      await lessonsService.delete(taskId)

      setThemes((prev) =>
        prev.map((t) =>
          t.id === themeId
            ? { ...t, tasks: t.tasks.filter((task) => task.id !== taskId) }
            : t
        )
      )

      if (selectedTaskId === taskId) {
        setSelectedTaskId("")
      }
    } catch (err) {
      console.error("Error eliminando tarea:", err)
    }
  }

  const handleAddTheme = async () => {
    if (!course) return

    try {
      const newTheme = await themesService.create({
        title: `Nuevo Tema ${themes.length + 1}`,
        description: "",
        courseId: course._id,
        order: themes.length,
      })

      const newThemeUI: ThemeUI = {
        id: newTheme._id,
        title: newTheme.title,
        description: newTheme.description || "",
        highlightedText: newTheme.highlightedText || "",
        durationMinutes: 0,
        requiresPreviousCompletion: newTheme.requiresPreviousCompletion ?? true,
        unlockThreshold: newTheme.unlockThreshold ?? 100,
        order: newTheme.order,
        tasks: [],
      }

      setThemes((prev) => [...prev, newThemeUI])
      setSelectedThemeId(newTheme._id)
    } catch (err) {
      console.error("Error creando tema:", err)
    }
  }

  const handleAddVideo = async () => {
    if (!selectedThemeId) return
    router.push(`/dashboard/modules/${moduleId}/lesson/new?type=video&themeId=${selectedThemeId}`)
  }

  const handleAddQuiz = () => {
    router.push(`/dashboard/modules/${moduleId}/quiz/new?themeId=${selectedThemeId}`)
  }

  const handleAddUpload = async () => {
    if (!selectedThemeId) return
    router.push(`/dashboard/modules/${moduleId}/lesson/new?type=exercise&themeId=${selectedThemeId}`)
  }

  const handleAddOther = async () => {
    if (!selectedThemeId) return
    router.push(`/dashboard/modules/${moduleId}/lesson/new?type=reading&themeId=${selectedThemeId}`)
  }

  const handleEditTask = (themeId: string, taskId: string, taskType: string) => {
    // Si es quiz, ir al editor de quiz
    if (taskType === "quiz") {
      router.push(`/dashboard/modules/${moduleId}/quiz/${taskId}`)
    } else {
      // Para otros tipos, ir al editor de lección
      router.push(`/dashboard/modules/${moduleId}/lesson/${taskId}`)
    }
  }

  const handlePreview = () => {
    if (course?._id) {
      window.open(`/preview/course/${course._id}`, "_blank")
    }
  }

  const handlePublish = async () => {
    if (!course) return

    try {
      await coursesService.update(course._id, { status: CourseStatus.PUBLISHED })
      // Actualizar estado local
      setCourse((prev) => (prev ? { ...prev, status: CourseStatus.PUBLISHED } : prev))
    } catch (err) {
      console.error("Error publicando módulo:", err)
    }
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400">Cargando módulo...</p>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="p-4 rounded-full bg-red-500/10">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-400 text-center max-w-md">{error}</p>
        <div className="flex gap-3">
          <Link
            href="/dashboard/modules"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Volver al listado
          </Link>
          <button
            onClick={loadCourseData}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Sin datos
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-slate-400">Módulo no encontrado</p>
        <Link
          href="/dashboard/modules"
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/modules"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
              Módulo: {course.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {themes.length} temas · {themes.reduce((acc, t) => acc + t.tasks.length, 0)} lecciones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
          >
            <Eye className="w-5 h-5" />
            Vista Previa
          </button>
          <button
            onClick={handlePublish}
            disabled={course.status === CourseStatus.PUBLISHED}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            <Send className="w-5 h-5" />
            {course.status === CourseStatus.PUBLISHED ? "Publicado" : "Publicar Módulo"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Structure Sidebar */}
        <ModuleStructureSidebar
          themes={themes}
          selectedThemeId={selectedThemeId}
          selectedTaskId={selectedTaskId}
          onSelectTheme={setSelectedThemeId}
          onSelectTask={(themeId, taskId) => {
            setSelectedThemeId(themeId)
            setSelectedTaskId(taskId)
          }}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAddTheme={handleAddTheme}
          onDeleteTheme={handleDeleteTheme}
        />

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-10">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Theme Details */}
            {selectedTheme ? (
              <ThemeEditor
                theme={{
                  id: selectedTheme.id,
                  title: selectedTheme.title,
                  description: selectedTheme.description,
                  highlightedText: selectedTheme.highlightedText,
                  durationMinutes: selectedTheme.durationMinutes,
                  requiresPreviousCompletion: selectedTheme.requiresPreviousCompletion,
                  unlockThreshold: selectedTheme.unlockThreshold,
                  order: selectedTheme.order,
                }}
                onChange={handleThemeChange}
                onDelete={() => handleDeleteTheme()}
                isSaving={isSaving}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">
                  Selecciona un tema o crea uno nuevo para comenzar a editar
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Add Tasks Section */}
            <div className="space-y-8 pb-10">
              <AddTasksSection />
              <TaskTypeCards
                onAddVideo={handleAddVideo}
                onAddQuiz={handleAddQuiz}
                onAddUpload={handleAddUpload}
                onAddOther={handleAddOther}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Autosave Indicator - Fixed at bottom of sidebar */}
      <div className="fixed bottom-24 left-4 w-56">
        <div className="glass-effect rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
            Modo Editor
          </p>
          <div className="flex justify-center items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-emerald-500 font-bold">
              Autoguardado activo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
