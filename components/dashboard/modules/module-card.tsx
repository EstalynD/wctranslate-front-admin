"use client"

import Image from "next/image"
import { Pencil, Eye, Trash2, Layers, User, Signal } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
type ModuleStatus = "published" | "draft" | "archived"

interface ModuleCardProps {
  id: string
  title: string
  image?: string
  status: ModuleStatus
  topicsCount: number
  modelsCount: number
  level?: string
  priority?: boolean
  onEdit?: () => void
  onPreview?: () => void
  onDelete?: () => void
  className?: string
}

/* ===== Status Config ===== */
const statusConfig: Record<ModuleStatus, { label: string; classes: string }> = {
  published: {
    label: "Publicado",
    classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  draft: {
    label: "Borrador",
    classes: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  archived: {
    label: "Archivado",
    classes: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  },
}

/* ===== Solid Color Fallbacks ===== */
const solidColors = [
  "bg-gradient-to-br from-blue-600 to-blue-800",
  "bg-gradient-to-br from-emerald-600 to-emerald-800",
  "bg-gradient-to-br from-amber-600 to-amber-800",
  "bg-gradient-to-br from-rose-600 to-rose-800",
  "bg-gradient-to-br from-violet-600 to-violet-800",
  "bg-gradient-to-br from-cyan-600 to-cyan-800",
]

function getColorByIndex(index: number): string {
  return solidColors[index % solidColors.length]
}

/* ===== Component ===== */
export function ModuleCard({
  id,
  title,
  image,
  status,
  topicsCount,
  modelsCount,
  level,
  priority = false,
  onEdit,
  onPreview,
  onDelete,
  className,
}: ModuleCardProps) {
  const statusInfo = statusConfig[status]
  // Usar el ID para generar un índice consistente de color
  const colorIndex = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const fallbackColor = getColorByIndex(colorIndex)

  return (
    <div
      className={cn(
        "glass-effect rounded-2xl overflow-hidden border border-white/5 group hover:border-blue-600/30 transition-all flex flex-col",
        className
      )}
    >
      {/* Image / Fallback Color */}
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              fallbackColor
            )}
          >
            <Layers className="w-16 h-16 text-white/30" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider backdrop-blur-md",
              statusInfo.classes
            )}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Level */}
        {level && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Signal className="w-3 h-3" />
              {level}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-semibold">{topicsCount} Temas</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <User className="w-4 h-4" />
            <span className="text-xs font-semibold">{modelsCount} Modelos</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onPreview}
              className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"
              title="Vista Previa"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onDelete}
            className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-rose-500/20 hover:text-rose-500 transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===== Add Module Card ===== */
interface AddModuleCardProps {
  onClick?: () => void
  className?: string
}

export function AddModuleCard({ onClick, className }: AddModuleCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-600/50 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center min-h-[360px] group",
        className
      )}
    >
      <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-slate-400 font-bold group-hover:text-white transition-colors">
        Nuevo Módulo
      </span>
      <span className="text-xs text-slate-600 px-8 text-center mt-2">
        Crea una nueva secuencia de formación
      </span>
    </button>
  )
}
