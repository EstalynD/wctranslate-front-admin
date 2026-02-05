"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { ModuleCard, AddModuleCard } from "@/components/dashboard/modules"
import { Search, ChevronDown, SlidersHorizontal, PlusCircle } from "lucide-react"

/* ===== Types ===== */
interface Module {
  id: string
  title: string
  image?: string
  status: "published" | "draft" | "archived"
  topicsCount: number
  modelsCount: number
}

/* ===== Mock Data ===== */
const mockModules: Module[] = [
  {
    id: "MOD-001",
    title: "Protocolos de Comunicación",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop",
    status: "published",
    topicsCount: 12,
    modelsCount: 142,
  },
  {
    id: "MOD-002",
    title: "Cierre y Monetización",
    status: "draft",
    topicsCount: 8,
    modelsCount: 0,
  },
  {
    id: "MOD-003",
    title: "Iluminación y Setup",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    status: "published",
    topicsCount: 15,
    modelsCount: 289,
  },
  {
    id: "MOD-004",
    title: "Psicología del Usuario",
    status: "archived",
    topicsCount: 5,
    modelsCount: 12,
  },
  {
    id: "MOD-005",
    title: "Técnicas de Persuasión",
    status: "published",
    topicsCount: 10,
    modelsCount: 78,
  },
  {
    id: "MOD-006",
    title: "Manejo de Objeciones",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
    status: "draft",
    topicsCount: 6,
    modelsCount: 0,
  },
  {
    id: "MOD-007",
    title: "Branding Personal",
    status: "published",
    topicsCount: 9,
    modelsCount: 156,
  },
]

export default function ModulesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("")

  // Filtrar módulos
  const filteredModules = mockModules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || module.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Ordenar módulos
  const sortedModules = [...filteredModules].sort((a, b) => {
    if (sortBy === "topics") return b.topicsCount - a.topicsCount
    if (sortBy === "popular") return b.modelsCount - a.modelsCount
    return 0 // Por defecto, mantener orden original (más recientes)
  })

  const handleCreateModule = () => {
    router.push("/dashboard/modules/new")
  }

  const handleEditModule = (id: string) => {
    router.push(`/dashboard/modules/${id}`)
  }

  const handlePreviewModule = (id: string) => {
    console.log("Vista previa módulo:", id)
  }

  const handleDeleteModule = (id: string) => {
    console.log("Eliminar módulo:", id)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        title="Listado de Módulos"
        description="Gestiona el catálogo de formación para tus modelos"
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
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all min-w-[140px] cursor-pointer"
              >
                <option value="">Estado: Todos</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
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

            {/* Advanced Filter Button */}
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-600/50 transition-all">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedModules.map((module) => (
            <ModuleCard
              key={module.id}
              id={module.id}
              title={module.title}
              image={module.image}
              status={module.status}
              topicsCount={module.topicsCount}
              modelsCount={module.modelsCount}
              onEdit={() => handleEditModule(module.id)}
              onPreview={() => handlePreviewModule(module.id)}
              onDelete={() => handleDeleteModule(module.id)}
            />
          ))}

          {/* Add New Module Card */}
          <AddModuleCard onClick={handleCreateModule} />
        </div>

        {/* Empty State */}
        {sortedModules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No se encontraron módulos
            </h3>
            <p className="text-slate-400 text-sm text-center max-w-md">
              No hay módulos que coincidan con tu búsqueda. Intenta con otros filtros o crea un nuevo módulo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
