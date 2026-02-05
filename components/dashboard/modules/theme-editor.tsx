"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { PenLine, Clock, ListPlus } from "lucide-react"

/* ===== Types ===== */
interface ThemeData {
  id: string
  title: string
  description: string
  durationMinutes: number
  requiredLevel: "silver" | "gold" | "diamond"
}

interface ThemeEditorProps {
  theme: ThemeData
  onChange?: (theme: ThemeData) => void
  className?: string
}

/* ===== Component ===== */
export function ThemeEditor({ theme, onChange, className }: ThemeEditorProps) {
  const [formData, setFormData] = useState<ThemeData>(theme)

  const handleChange = (
    field: keyof ThemeData,
    value: string | number
  ) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onChange?.(updated)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
            <PenLine className="w-5 h-5 text-blue-400" />
          </div>
          <h4 className="text-xl font-bold text-white">Detalles del Tema</h4>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-600/10 text-blue-400 border border-blue-600/20 uppercase tracking-widest">
          ID: {formData.id}
        </span>
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
            rows={4}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-slate-300 outline-none transition-all resize-none"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Duración Estimada (Min)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="number"
              min={1}
              value={formData.durationMinutes}
              onChange={(e) =>
                handleChange("durationMinutes", parseInt(e.target.value) || 0)
              }
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl pl-10 pr-4 py-3 text-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Required Level */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Nivel Mínimo Requerido
          </label>
          <select
            value={formData.requiredLevel}
            onChange={(e) =>
              handleChange(
                "requiredLevel",
                e.target.value as ThemeData["requiredLevel"]
              )
            }
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
          >
            <option value="silver" className="bg-slate-900">
              Silver
            </option>
            <option value="gold" className="bg-slate-900">
              Gold
            </option>
            <option value="diamond" className="bg-slate-900">
              Diamond
            </option>
          </select>
        </div>
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
