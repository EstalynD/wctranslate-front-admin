"use client"

import Image from "next/image"
import { Pencil, Trash2, Globe, Power, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlatformStatus, PlatformType, platformTypeLabels } from "@/lib/api"

/* ===== Types ===== */
interface PlatformCardProps {
  id: string
  name: string
  type: PlatformType
  description?: string
  favicon?: string | null
  logoUrl?: string | null
  websiteUrl?: string | null
  status: PlatformStatus
  priority?: boolean
  onEdit?: () => void
  onToggleStatus?: () => void
  onDelete?: () => void
  className?: string
}

/* ===== Status Config ===== */
const statusConfig: Record<PlatformStatus, { label: string; classes: string }> = {
  [PlatformStatus.ACTIVE]: {
    label: "Activa",
    classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  [PlatformStatus.INACTIVE]: {
    label: "Inactiva",
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
export function PlatformCard({
  id,
  name,
  type,
  description,
  favicon,
  logoUrl,
  websiteUrl,
  status,
  priority = false,
  onEdit,
  onToggleStatus,
  onDelete,
  className,
}: PlatformCardProps) {
  const statusInfo = statusConfig[status]
  // Usar el ID para generar un índice consistente de color
  const colorIndex = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const fallbackColor = getColorByIndex(colorIndex)

  const imageToShow = logoUrl || favicon

  return (
    <div
      className={cn(
        "glass-effect rounded-2xl overflow-hidden border border-white/5 group hover:border-blue-600/30 transition-all flex flex-col",
        className
      )}
    >
      {/* Image / Fallback Color */}
      <div className="relative h-36 overflow-hidden">
        {imageToShow ? (
          <Image
            src={imageToShow}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={priority}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              fallbackColor
            )}
          >
            <Globe className="w-12 h-12 text-white/30" />
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

        {/* Favicon pequeño si hay logo */}
        {logoUrl && favicon && (
          <div className="absolute top-3 right-3">
            <Image
              src={favicon}
              alt={`${name} favicon`}
              width={24}
              height={24}
              className="rounded-md"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">
          {name}
        </h3>

        {/* Type Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider bg-blue-500/10 text-blue-400 border-blue-500/30">
            {platformTypeLabels[type]}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Website URL */}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="truncate max-w-[180px]">{websiteUrl.replace(/^https?:\/\//, '')}</span>
          </a>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleStatus}
              className={cn(
                "size-9 rounded-lg bg-white/5 flex items-center justify-center transition-all",
                status === PlatformStatus.ACTIVE
                  ? "text-emerald-400 hover:bg-slate-500/20 hover:text-slate-400"
                  : "text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400"
              )}
              title={status === PlatformStatus.ACTIVE ? "Desactivar" : "Activar"}
            >
              <Power className="w-4 h-4" />
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

/* ===== Add Platform Card ===== */
interface AddPlatformCardProps {
  onClick?: () => void
  className?: string
}

export function AddPlatformCard({ onClick, className }: AddPlatformCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-600/50 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center min-h-[320px] group",
        className
      )}
    >
      <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-slate-400 font-bold group-hover:text-white transition-colors">
        Nueva Plataforma
      </span>
      <span className="text-xs text-slate-600 px-8 text-center mt-2">
        Agrega una nueva plataforma de streaming
      </span>
    </button>
  )
}
