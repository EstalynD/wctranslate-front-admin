"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  ImagePlus,
  X,
  Layers,
  FileText,
  Clock,
  Shield,
  Palette,
} from "lucide-react"

/* ===== Types ===== */
interface ModuleFormData {
  title: string
  description: string
  image?: string
  coverColor: string
  status: "draft" | "published"
  requiredLevel: "silver" | "gold" | "diamond"
  estimatedDuration: number
}

interface ModuleFormProps {
  initialData?: Partial<ModuleFormData>
  onSubmit?: (data: ModuleFormData) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

/* ===== Cover Color Options ===== */
const coverColors = [
  { id: "blue", gradient: "from-blue-600 to-blue-800", label: "Azul" },
  { id: "emerald", gradient: "from-emerald-600 to-emerald-800", label: "Esmeralda" },
  { id: "amber", gradient: "from-amber-600 to-amber-800", label: "Ámbar" },
  { id: "rose", gradient: "from-rose-600 to-rose-800", label: "Rosa" },
  { id: "violet", gradient: "from-violet-600 to-violet-800", label: "Violeta" },
  { id: "cyan", gradient: "from-cyan-600 to-cyan-800", label: "Cian" },
]

/* ===== Default Values ===== */
const defaultFormData: ModuleFormData = {
  title: "",
  description: "",
  image: undefined,
  coverColor: "blue",
  status: "draft",
  requiredLevel: "silver",
  estimatedDuration: 60,
}

/* ===== Component ===== */
export function ModuleForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: ModuleFormProps) {
  const [formData, setFormData] = useState<ModuleFormData>({
    ...defaultFormData,
    ...initialData,
  })
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.image
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    field: keyof ModuleFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(undefined)
    setFormData((prev) => ({ ...prev, image: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const selectedColor = coverColors.find((c) => c.id === formData.coverColor)

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      {/* Cover Image Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
            <ImagePlus className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Imagen de Portada</h4>
            <p className="text-xs text-slate-400">
              Sube una imagen o selecciona un color de fondo
            </p>
          </div>
        </div>

        {/* Image Preview / Upload Area */}
        <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10">
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 size-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div
              className={cn(
                "w-full h-full flex flex-col items-center justify-center bg-gradient-to-br",
                selectedColor?.gradient || "from-blue-600 to-blue-800"
              )}
            >
              <Layers className="w-12 h-12 text-white/30 mb-3" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors"
              >
                Subir Imagen
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Color Selector (only if no image) */}
        {!imagePreview && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <Palette className="w-3 h-3" />
              Color de Fondo
            </label>
            <div className="flex gap-2">
              {coverColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleChange("coverColor", color.id)}
                  className={cn(
                    "size-10 rounded-xl bg-gradient-to-br transition-all",
                    color.gradient,
                    formData.coverColor === color.id
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950"
                      : "hover:scale-110"
                  )}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Basic Info Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="text-lg font-bold text-white">Información Básica</h4>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Nombre del Módulo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ej: Protocolos de Comunicación"
              required
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white font-medium outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe de qué trata este módulo..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-slate-300 outline-none transition-all resize-none placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <h4 className="text-lg font-bold text-white">Configuración</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Duration */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <Clock className="w-3 h-3" />
              Duración Estimada (minutos)
            </label>
            <input
              type="number"
              min={15}
              step={15}
              value={formData.estimatedDuration}
              onChange={(e) =>
                handleChange("estimatedDuration", parseInt(e.target.value) || 60)
              }
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all"
            />
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
                  e.target.value as ModuleFormData["requiredLevel"]
                )
              }
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
            >
              <option value="silver" className="bg-slate-900">
                Silver - Básico
              </option>
              <option value="gold" className="bg-slate-900">
                Gold - Intermedio
              </option>
              <option value="diamond" className="bg-slate-900">
                Diamond - Avanzado
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-slate-400 hover:text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !formData.title.trim()}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando...
            </>
          ) : (
            "Crear Módulo"
          )}
        </button>
      </div>
    </form>
  )
}
