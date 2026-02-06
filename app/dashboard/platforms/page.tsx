"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/dashboard/header"
import {
  Search,
  ChevronDown,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  Pencil,
  Power,
  Trash2,
  ExternalLink,
  Globe,
} from "lucide-react"
import {
  platformsService,
  type Platform,
  type QueryPlatformsParams,
  PlatformStatus,
  platformStatusLabels,
  platformTypeLabels,
} from "@/lib/api"

const statusClasses: Record<PlatformStatus, string> = {
  [PlatformStatus.ACTIVE]: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [PlatformStatus.INACTIVE]: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

export default function PlatformsPage() {
  const router = useRouter()

  // Estado de datos
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [totalPlatforms, setTotalPlatforms] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Estado de carga y errores
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PlatformStatus | "">("")

  // Cargar plataformas
  const loadPlatforms = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: QueryPlatformsParams = {
        page: currentPage,
        limit: 12,
      }

      if (statusFilter) params.status = statusFilter

      const response = await platformsService.getAll(params)

      setPlatforms(response.data)
      setTotalPlatforms(response.total)
      setTotalPages(response.totalPages)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar plataformas"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, statusFilter])

  // Cargar al montar y cuando cambien los filtros
  useEffect(() => {
    loadPlatforms()
  }, [loadPlatforms])

  // Filtrar localmente por búsqueda
  const filteredPlatforms = platforms.filter((platform) =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Ordenar por displayOrder
  const sortedPlatforms = [...filteredPlatforms].sort((a, b) =>
    a.displayOrder - b.displayOrder
  )

  const handleCreatePlatform = () => {
    router.push("/dashboard/platforms/new")
  }

  const handleEditPlatform = (id: string) => {
    router.push(`/dashboard/platforms/${id}`)
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await platformsService.toggleStatus(id)
      // Recargar la lista
      loadPlatforms()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cambiar estado"
      alert(message)
    }
  }

  const handleDeletePlatform = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta plataforma? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await platformsService.delete(id)
      // Recargar la lista
      loadPlatforms()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar"
      alert(message)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        title="Plataformas"
        description={`${totalPlatforms} plataformas en total`}
        action={{
          label: "Nueva Plataforma",
          icon: PlusCircle,
          onClick: handleCreatePlatform,
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
              placeholder="Buscar plataformas por nombre..."
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
                  setStatusFilter(e.target.value as PlatformStatus | "")
                  setCurrentPage(1)
                }}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all min-w-[140px] cursor-pointer"
              >
                <option value="">Estado: Todos</option>
                <option value={PlatformStatus.ACTIVE}>Activas</option>
                <option value={PlatformStatus.INACTIVE}>Inactivas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadPlatforms}
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
              onClick={loadPlatforms}
              className="text-sm text-red-400 hover:text-red-300 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && platforms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400">Cargando plataformas...</p>
          </div>
        )}

        {/* Platforms List */}
        {!isLoading && sortedPlatforms.length > 0 && (
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <div className="hidden md:grid grid-cols-[40px_1.2fr_1fr_1fr_120px_140px] gap-4 px-4 py-3 text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
              <span></span>
              <span>Plataforma</span>
              <span>Tipo</span>
              <span>Web</span>
              <span>Estado</span>
              <span className="text-right">Acciones</span>
            </div>
            <div className="divide-y divide-white/5">
              {sortedPlatforms.map((platform) => {
                const imageUrl = platform.logoUrl || platform.favicon
                return (
                  <div
                    key={platform._id}
                    className="flex flex-col gap-3 md:grid md:grid-cols-[40px_1.2fr_1fr_1fr_120px_140px] md:items-center md:gap-4 px-4 py-4"
                  >
                    <div className="relative size-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={platform.name}
                          fill
                          sizes="40px"
                          unoptimized
                          referrerPolicy="no-referrer"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <Globe className="w-5 h-5 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {platform.name}
                      </p>
                      {platform.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {platform.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {platformTypeLabels[platform.type]}
                      </span>
                    </div>

                    <div>
                      {platform.websiteUrl ? (
                        <a
                          href={platform.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[180px]">
                            {platform.websiteUrl.replace(/^https?:\/\//, "")}
                          </span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusClasses[platform.status]}`}
                      >
                        {platformStatusLabels[platform.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 md:justify-end">
                      <button
                        onClick={() => handleEditPlatform(platform._id)}
                        className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(platform._id)}
                        className={`size-9 rounded-lg bg-white/5 flex items-center justify-center transition-all ${
                          platform.status === PlatformStatus.ACTIVE
                            ? "text-emerald-400 hover:bg-slate-500/20 hover:text-slate-400"
                            : "text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400"
                        }`}
                        title={
                          platform.status === PlatformStatus.ACTIVE
                            ? "Desactivar"
                            : "Activar"
                        }
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlatform(platform._id)}
                        className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sortedPlatforms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {platforms.length === 0 ? "No hay plataformas creadas" : "No se encontraron plataformas"}
            </h3>
            <p className="text-slate-400 text-sm text-center max-w-md mb-6">
              {platforms.length === 0
                ? "Comienza agregando tu primera plataforma de streaming."
                : "No hay plataformas que coincidan con tu búsqueda. Intenta con otros filtros."}
            </p>
            {platforms.length === 0 && (
              <button
                onClick={handleCreatePlatform}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Crear Primera Plataforma
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
