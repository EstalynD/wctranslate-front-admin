"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  PenLine,
  Clock,
  ListPlus,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  Save,
  Loader2,
} from "lucide-react"

/* ===== Types ===== */
export interface ThemeData {
  id: string
  title: string
  description: string
  highlightedText: string
  durationMinutes: number
  requiresPreviousCompletion: boolean
  unlockThreshold: number
  order: number
}

interface ThemeEditorProps {
  theme: ThemeData
  onChange?: (theme: ThemeData) => void
  onDelete?: () => void
  isSaving?: boolean
  className?: string
}

/* ===== Component ===== */
export function ThemeEditor({
  theme,
  onChange,
  onDelete,
  isSaving,
  className,
}: ThemeEditorProps) {
  const [formData, setFormData] = useState<ThemeData>(theme)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar cuando cambia el tema seleccionado
  useEffect(() => {
    setFormData(theme)
    setShowDeleteConfirm(false)
  }, [theme.id]) // Solo resetear cuando cambia el ID del tema

  const handleChange = useCallback(
    (field: keyof ThemeData, value: string | number | boolean) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value }
        // Debounce el onChange para no llamar en cada keystroke
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          onChange?.(updated)
        }, 600)
        return updated
      })
    },
    [onChange]
  )

  const handleSaveNow = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    onChange?.(formData)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
            <PenLine className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Detalles del Tema</h4>
            <p className="text-xs text-slate-500">
              Orden #{formData.order + 1}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="flex items-center gap-1.5 text-xs text-blue-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Guardando...
            </span>
          )}
          <button
            onClick={handleSaveNow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Título del Tema
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white font-medium outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-slate-300 outline-none transition-all resize-none"
          />
        </div>

        {/* Highlighted Text */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Texto Destacado
          </label>
          <input
            type="text"
            value={formData.highlightedText}
            onChange={(e) => handleChange("highlightedText", e.target.value)}
            placeholder="Texto que aparece con gradiente visual"
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white font-medium outline-none transition-all placeholder:text-slate-600"
          />
          <p className="text-[10px] text-slate-600">
            Se muestra con estilo gradiente en la vista del estudiante
          </p>
        </div>

        {/* Duration (read-only, calculado por el backend) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Duración Total (Min)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="number"
              min={0}
              value={formData.durationMinutes}
              readOnly
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-slate-400 outline-none cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] text-slate-600">
            Calculado automáticamente con las lecciones
          </p>
        </div>

        {/* Unlock Threshold */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Umbral de Desbloqueo (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={formData.unlockThreshold}
            onChange={(e) =>
              handleChange(
                "unlockThreshold",
                Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
              )
            }
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all"
          />
          <p className="text-[10px] text-slate-600">
            Porcentaje del tema anterior que debe completarse para desbloquear este
          </p>
        </div>

        {/* Requires Previous Completion */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() =>
              handleChange(
                "requiresPreviousCompletion",
                !formData.requiresPreviousCompletion
              )
            }
            className={cn(
              "flex items-center gap-3 w-full p-4 rounded-xl border transition-all",
              formData.requiresPreviousCompletion
                ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            {formData.requiresPreviousCompletion ? (
              <Lock className="w-5 h-5 text-amber-400" />
            ) : (
              <Unlock className="w-5 h-5 text-slate-400" />
            )}
            <div className="text-left flex-1">
              <p
                className={cn(
                  "text-sm font-bold",
                  formData.requiresPreviousCompletion
                    ? "text-amber-400"
                    : "text-slate-400"
                )}
              >
                {formData.requiresPreviousCompletion
                  ? "Requiere completar tema anterior"
                  : "Sin requisito previo"}
              </p>
              <p className="text-[10px] text-slate-600">
                {formData.requiresPreviousCompletion
                  ? "El estudiante debe completar el tema anterior antes de acceder a este"
                  : "El estudiante puede acceder a este tema libremente"}
              </p>
            </div>
            <div
              className={cn(
                "w-10 h-6 rounded-full relative transition-colors",
                formData.requiresPreviousCompletion
                  ? "bg-amber-500"
                  : "bg-slate-700"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                  formData.requiresPreviousCompletion ? "right-1" : "left-1"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Zona de peligro: Eliminar tema */}
      <div className="pt-4 border-t border-white/5">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-xs font-medium text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar este tema
          </button>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-400 flex-1">
              Se eliminarán todas las lecciones de este tema. Esta acción no se puede deshacer.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ===== Add Tasks Section Header ===== */
interface AddTasksSectionProps {
  className?: string
}

export function AddTasksSection({ className }: AddTasksSectionProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
        <ListPlus className="w-5 h-5 text-rose-400" />
      </div>
      <h4 className="text-xl font-bold text-white">Añadir Tarea al Tema</h4>
    </div>
  )
}
