"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { LessonResource } from "@/lib/api"
import {
  FileText,
  Play,
  Image as ImageIcon,
  FileQuestion,
  File,
  Plus,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react"

/* ===== Types ===== */
interface ResourcesEditorProps {
  resources: LessonResource[]
  onChange: (resources: LessonResource[]) => void
  className?: string
}

/* ===== Resource Type Config ===== */
const resourceTypeConfig: Record<
  LessonResource["type"],
  { icon: typeof FileText; color: string }
> = {
  pdf: { icon: FileText, color: "text-red-400" },
  video: { icon: Play, color: "text-purple-400" },
  image: { icon: ImageIcon, color: "text-pink-400" },
  document: { icon: FileQuestion, color: "text-blue-400" },
  other: { icon: File, color: "text-slate-400" },
}

/* ===== Add Resource Form ===== */
function AddResourceForm({
  onAdd,
  onCancel,
}: {
  onAdd: (resource: Omit<LessonResource, "id">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "pdf" as LessonResource["type"],
    url: "",
    size: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.url) return
    onAdd(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white/5 rounded-xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Nombre del archivo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            placeholder="Guía de usuario.pdf"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Tipo
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as LessonResource["type"],
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="image">Imagen</option>
            <option value="document">Documento</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            URL del archivo
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            placeholder="https://..."
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Tamaño
          </label>
          <input
            type="text"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
            placeholder="2.5 MB"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          Agregar Recurso
        </button>
      </div>
    </form>
  )
}

/* ===== Resource Card ===== */
function ResourceCard({
  resource,
  onDelete,
}: {
  resource: LessonResource
  onDelete: () => void
}) {
  const config = resourceTypeConfig[resource.type]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all group">
      <div
        className={cn(
          "size-10 rounded-lg flex items-center justify-center bg-white/5"
        )}
      >
        <Icon className={cn("w-5 h-5", config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{resource.name}</p>
        <p className="text-xs text-slate-400">{resource.size || "Tamaño desconocido"}</p>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Abrir en nueva pestaña"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
        <a
          href={resource.url}
          download={resource.name}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Descargar"
        >
          <Download className="w-4 h-4 text-slate-400" />
        </a>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  )
}

/* ===== Main Component ===== */
export function ResourcesEditor({
  resources,
  onChange,
  className,
}: ResourcesEditorProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = (resource: Omit<LessonResource, "id">) => {
    const newResource: LessonResource = {
      ...resource,
      id: `res-${Date.now()}`,
    }
    onChange([...resources, newResource])
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    onChange(resources.filter((r) => r.id !== id))
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
            <Download className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Recursos Descargables</h4>
            <p className="text-xs text-slate-400">
              {resources.length} {resources.length === 1 ? "archivo" : "archivos"}
            </p>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium text-sm text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <AddResourceForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />
      )}

      {/* Resources List */}
      {resources.length > 0 ? (
        <div className="space-y-2">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDelete={() => handleDelete(resource.id)}
            />
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
            <Download className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">
              No hay recursos adjuntos a esta lección
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 text-emerald-400 text-sm font-medium hover:underline"
            >
              Agregar el primero
            </button>
          </div>
        )
      )}
    </div>
  )
}
