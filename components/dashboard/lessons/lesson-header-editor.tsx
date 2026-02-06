"use client"

import { cn } from "@/lib/utils"
import { LessonType, LessonStatus, lessonTypeLabels } from "@/lib/api"
import {
  Play,
  BookOpen,
  HelpCircle,
  Upload,
  Download,
  FileText,
} from "lucide-react"

/* ===== Types ===== */
export interface LessonHeaderData {
  title: string
  description: string
  type: LessonType
  status: LessonStatus
  durationMinutes: number
  isPreview: boolean
}

interface LessonHeaderEditorProps {
  data: LessonHeaderData
  onChange: (data: Partial<LessonHeaderData>) => void
  className?: string
}

/* ===== Icon Map ===== */
const typeIcons: Record<LessonType, typeof Play> = {
  [LessonType.VIDEO]: Play,
  [LessonType.READING]: BookOpen,
  [LessonType.QUIZ]: HelpCircle,
  [LessonType.EXERCISE]: Upload,
  [LessonType.DOWNLOAD]: Download,
}

/* ===== Component ===== */
export function LessonHeaderEditor({
  data,
  onChange,
  className,
}: LessonHeaderEditorProps) {
  const TypeIcon = typeIcons[data.type] || FileText

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
            <TypeIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="text-xl font-bold text-white">Información de la Lección</h4>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
              data.status === LessonStatus.PUBLISHED
                ? "bg-emerald-600/10 text-emerald-400 border-emerald-600/20"
                : "bg-amber-600/10 text-amber-400 border-amber-600/20"
            )}
          >
            {data.status === LessonStatus.PUBLISHED ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Título de la Lección
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-600 focus:border-transparent rounded-xl px-4 py-3 text-white font-medium outline-none transition-all"
            placeholder="Ej: Introducción al manejo de usuarios"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Descripción
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-600 focus:border-transparent rounded-xl px-4 py-3 text-slate-300 outline-none transition-all resize-none"
            placeholder="Describe brevemente el contenido de esta lección..."
          />
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Tipo de Lección
          </label>
          <select
            value={data.type}
            onChange={(e) => onChange({ type: e.target.value as LessonType })}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all"
          >
            {Object.entries(lessonTypeLabels).map(([value, label]) => (
              <option key={value} value={value} className="bg-slate-900">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Duración */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Duración (minutos)
          </label>
          <input
            type="number"
            min="0"
            value={data.durationMinutes}
            onChange={(e) =>
              onChange({ durationMinutes: parseInt(e.target.value) || 0 })
            }
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-emerald-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all"
          />
        </div>

        {/* Preview Toggle */}
        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
          <input
            type="checkbox"
            id="isPreview"
            checked={data.isPreview}
            onChange={(e) => onChange({ isPreview: e.target.checked })}
            className="w-5 h-5 rounded bg-white/10 border-white/20 text-emerald-600 focus:ring-emerald-600"
          />
          <label htmlFor="isPreview" className="flex-1">
            <span className="text-white font-medium">Disponible como Vista Previa</span>
            <p className="text-xs text-slate-400 mt-0.5">
              Permite que usuarios sin suscripción puedan ver esta lección
            </p>
          </label>
        </div>
      </div>
    </div>
  )
}
