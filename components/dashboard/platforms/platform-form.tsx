"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Globe,
  FileText,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import {
  platformsService,
  PlatformStatus,
  platformStatusLabels,
  PlatformType,
  platformTypeLabels,
  type CreatePlatformData,
  type UpdatePlatformData,
  type Platform,
} from "@/lib/api"

/* ===== Types ===== */
interface PlatformFormData {
  name: string
  description: string
  websiteUrl: string
  favicon: string
  type: PlatformType
  status: PlatformStatus
}

interface PlatformFormProps {
  initialData?: Partial<PlatformFormData> & {
    favicon?: string | null
  }
  platformId?: string // Para edición
  onSubmit?: (platform: Platform) => void
  onCancel?: () => void
  className?: string
}

/* ===== Status Options ===== */
const statusOptions = Object.values(PlatformStatus).map((status) => ({
  value: status,
  label: platformStatusLabels[status],
}))

const typeOptions = Object.values(PlatformType).map((type) => ({
  value: type,
  label: platformTypeLabels[type],
}))

/* ===== Default Values ===== */
const defaultFormData: PlatformFormData = {
  name: "",
  description: "",
  websiteUrl: "",
  favicon: "",
  type: PlatformType.TOKENS_CAM,
  status: PlatformStatus.ACTIVE,
}

/* ===== Component ===== */
export function PlatformForm({
  initialData,
  platformId,
  onSubmit,
  onCancel,
  className,
}: PlatformFormProps) {
  const [formData, setFormData] = useState<PlatformFormData>(defaultFormData)
  const [faviconPreview, setFaviconPreview] = useState<string | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!initialData) {
      setFormData(defaultFormData)
      setFaviconPreview(undefined)
      return
    }

    const normalizedData: PlatformFormData = {
      ...defaultFormData,
      ...initialData,
      name: initialData.name ?? "",
      description: initialData.description ?? "",
      websiteUrl: initialData.websiteUrl ?? "",
      favicon: initialData.favicon ?? "",
      type: initialData.type ?? defaultFormData.type,
      status: initialData.status ?? defaultFormData.status,
    }

    setFormData(normalizedData)
    setFaviconPreview(normalizedData.favicon || undefined)
  }, [initialData])

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
    }))
  }

  const handleChange = (
    field: keyof PlatformFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFaviconChange = (value: string) => {
    setFormData((prev) => ({ ...prev, favicon: value }))
    setFaviconPreview(value || undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validar campo requerido
      if (!formData.name.trim()) {
        throw new Error("El nombre es requerido")
      }

      let platform: Platform

      if (platformId) {
        // Actualizar plataforma existente
        const updateData: UpdatePlatformData = {
          name: formData.name,
          description: formData.description || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          favicon: formData.favicon || undefined,
          type: formData.type,
          status: formData.status,
        }

        platform = await platformsService.update(platformId, updateData)
      } else {
        // Crear nueva plataforma
        const createData: CreatePlatformData = {
          name: formData.name,
          description: formData.description || undefined,
          websiteUrl: formData.websiteUrl || undefined,
          favicon: formData.favicon || undefined,
          type: formData.type,
          status: formData.status,
        }

        platform = await platformsService.create(createData)
      }

      setSuccess(true)
      onSubmit?.(platform)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar la plataforma"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400">
            Plataforma {platformId ? "actualizada" : "creada"} correctamente
          </p>
        </div>
      )}

      {/* Section: Información Básica */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Información Básica
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name ?? ""}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Chaturbate"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              Tipo de Plataforma <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.type ?? PlatformType.TOKENS_CAM}
              onChange={(e) => handleChange("type", e.target.value as PlatformType)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              required
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Descripción
          </label>
          <textarea
            value={formData.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Breve descripción de la plataforma..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-slate-500" />
            URL del Sitio Web
          </label>
          <input
            type="url"
            value={formData.websiteUrl ?? ""}
            onChange={(e) => handleChange("websiteUrl", e.target.value)}
            placeholder="https://www.ejemplo.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm text-slate-300 font-medium">Estado</label>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("status", option.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  (formData.status ?? PlatformStatus.ACTIVE) === option.value
                    ? option.value === PlatformStatus.ACTIVE
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Favicon */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Favicon
          </h3>
        </div>

        <div className="space-y-3">
          <label className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-slate-500" />
            URL del Favicon
          </label>
          <input
            type="url"
            value={formData.favicon ?? ""}
            onChange={(e) => handleFaviconChange(e.target.value)}
            placeholder="https://chaturbate.com/favicon.ico"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          />
          {faviconPreview && (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={faviconPreview}
                alt="Favicon preview"
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-contain p-2"
              />
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-sm rounded-xl transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {platformId ? "Actualizar" : "Crear"} Plataforma
            </>
          )}
        </button>
      </div>
    </form>
  )
}
