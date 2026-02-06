"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { ModuleCard, AddModuleCard } from "@/components/dashboard/modules"
import {
  Search,
  ChevronDown,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react"
import {
  coursesService,
  type Course,
  type QueryCoursesParams,
  CourseStatus,
  CourseCategory,
  categoryLabels,
} from "@/lib/api"

/* ===== Status mapping para el componente ===== */
const statusMap: Record<CourseStatus, "published" | "draft" | "archived"> = {
  [CourseStatus.PUBLISHED]: "published",
  [CourseStatus.DRAFT]: "draft",
  [CourseStatus.ARCHIVED]: "archived",
}

export default function ModulesPage() {
  const router = useRouter()

  // Estado de datos
  const [courses, setCourses] = useState<Course[]>([])
  const [totalCourses, setTotalCourses] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Estado de carga y errores
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "">("")
  const [categoryFilter, setCategoryFilter] = useState<CourseCategory | "">("")
  const [sortBy, setSortBy] = useState<string>("")

  // Cargar cursos
  const loadCourses = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: QueryCoursesParams = {
        page: currentPage,
        limit: 12,
      }

      if (statusFilter) params.status = statusFilter
      if (categoryFilter) params.category = categoryFilter

      const response = await coursesService.getAll(params)

      setCourses(response.courses)
      setTotalCourses(response.total)
      setTotalPages(response.totalPages)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar módulos"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, statusFilter, categoryFilter])

  // Cargar al montar y cuando cambien los filtros
  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  // Filtrar localmente por búsqueda
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Ordenar localmente
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "topics") return b.themes.length - a.themes.length
    if (sortBy === "popular") return b.enrolledCount - a.enrolledCount
    if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return a.displayOrder - b.displayOrder
  })

  const handleCreateModule = () => {
    router.push("/dashboard/modules/new")
  }

  const handleEditModule = (id: string) => {
    router.push(`/dashboard/modules/${id}`)
  }

  const handlePreviewModule = (id: string) => {
    // Abrir en nueva pestaña el módulo en el frontend de usuario
    window.open(`/preview/course/${id}`, "_blank")
  }

  const handleDeleteModule = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este módulo? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await coursesService.delete(id)
      // Recargar la lista
      loadCourses()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar"
      alert(message)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        title="Listado de Módulos"
        description={`${totalCourses} módulos en total`}
        action={{
          label: "Crear Nuevo Módulo",
          icon: PlusCircle,
          onClick: handleCreateModule,
        }}
      />

      {/* Filters */}
      <div className="px-8 py-6 bg-transparent border-b border-white/5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar módulos por nombre..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as CourseStatus | "")
                  setCurrentPage(1)
                }}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all min-w-[140px] cursor-pointer"
              >
                <option value="">Estado: Todos</option>
                <option value={CourseStatus.PUBLISHED}>Publicados</option>
                <option value={CourseStatus.DRAFT}>Borradores</option>
                <option value={CourseStatus.ARCHIVED}>Archivados</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value as CourseCategory | "")
                  setCurrentPage(1)
                }}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all min-w-[150px] cursor-pointer"
              >
                <option value="">Categoría: Todas</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all min-w-[140px] cursor-pointer"
              >
                <option value="">Ordenar por</option>
                <option value="recent">Más recientes</option>
                <option value="popular">Más populares</option>
                <option value="topics">Nº Temas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadCourses}
              disabled={isLoading}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-600/50 transition-all disabled:opacity-50"
              title="Recargar"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400 flex-1">{error}</p>
            <button
              onClick={loadCourses}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400">Cargando módulos...</p>
          </div>
        )}

        {/* Modules Grid */}
        {!isLoading && sortedCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCourses.map((course, index) => (
              <ModuleCard
                key={course._id}
                id={course._id}
                title={course.title}
                image={course.thumbnail ?? undefined}
                status={statusMap[course.status]}
                topicsCount={course.themes.length}
                modelsCount={course.enrolledCount}
                category={categoryLabels[course.category]}
                level={course.level}
                priority={index < 4}
                onEdit={() => handleEditModule(course._id)}
                onPreview={() => handlePreviewModule(course._id)}
                onDelete={() => handleDeleteModule(course._id)}
              />
            ))}

            {/* Add New Module Card */}
            <AddModuleCard onClick={handleCreateModule} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {courses.length === 0 ? "No hay módulos creados" : "No se encontraron módulos"}
            </h3>
            <p className="text-slate-400 text-sm text-center max-w-md mb-6">
              {courses.length === 0
                ? "Comienza creando tu primer módulo de formación para tus modelos."
                : "No hay módulos que coincidan con tu búsqueda. Intenta con otros filtros."}
            </p>
            {courses.length === 0 && (
              <button
                onClick={handleCreateModule}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Crear Primer Módulo
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:border-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-sm text-slate-400">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:border-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
