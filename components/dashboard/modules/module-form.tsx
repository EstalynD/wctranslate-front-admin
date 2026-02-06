"use client"

import { useState, useRef, useCallback } from "react"
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
  Tag,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import {
  coursesService,
  generateSlug,
  CourseLevel,
  CourseCategory,
  CourseStatus,
  PlanType,
  levelLabels,
  categoryLabels,
  planLabels,
  type CreateCourseData,
  type Course,
} from "@/lib/api"

/* ===== Types ===== */
interface ModuleFormData {
  title: string
  slug: string
  description: string
  category: CourseCategory
  level: CourseLevel
  status: CourseStatus
  allowedPlans: PlanType[]
  coverColor: string
  estimatedDuration: number
  isFeatured: boolean
}

interface ModuleFormProps {
  initialData?: Partial<ModuleFormData> & { thumbnail?: string }
  courseId?: string // Para edición
  onSubmit?: (course: Course) => void
  onCancel?: () => void
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

/* ===== Category Options ===== */
const categoryOptions = Object.values(CourseCategory).map((cat) => ({
  value: cat,
  label: categoryLabels[cat],
}))

/* ===== Level Options ===== */
const levelOptions = Object.values(CourseLevel).map((level) => ({
  value: level,
  label: levelLabels[level],
}))

/* ===== Plan Options ===== */
const planOptions = Object.values(PlanType).map((plan) => ({
  value: plan,
  label: planLabels[plan],
}))

/* ===== Default Values ===== */
const defaultFormData: ModuleFormData = {
  title: "",
  slug: "",
  description: "",
  category: CourseCategory.MARKETING,
  level: CourseLevel.BASIC,
  status: CourseStatus.DRAFT,
  allowedPlans: [PlanType.PRO, PlanType.ELITE],
  coverColor: "blue",
  estimatedDuration: 60,
  isFeatured: false,
}

/* ===== Component ===== */
export function ModuleForm({
  initialData,
  courseId,
  onSubmit,
  onCancel,
  className,
}: ModuleFormProps) {
  const [formData, setFormData] = useState<ModuleFormData>({
    ...defaultFormData,
    ...initialData,
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialData?.thumbnail ?? undefined
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Genera slug automáticamente cuando cambia el título (si no fue editado manualmente)
  const handleTitleChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: slugManuallyEdited ? prev.slug : generateSlug(value),
      }))
    },
    [slugManuallyEdited]
  )

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true)
    setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
  }

  const handleChange = (
    field: keyof ModuleFormData,
    value: string | number | boolean | PlanType[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlanToggle = (plan: PlanType) => {
    setFormData((prev) => {
      const plans = prev.allowedPlans.includes(plan)
        ? prev.allowedPlans.filter((p) => p !== plan)
        : [...prev.allowedPlans, plan]
      return { ...prev, allowedPlans: plans }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar los 5MB")
        return
      }

      // Validar tipo
      if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
        setError("Solo se permiten imágenes JPG, PNG, WebP o GIF")
        return
      }

      setThumbnailFile(file)
      setError(null)

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(undefined)
    setThumbnailFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const courseData: CreateCourseData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || undefined,
        category: formData.category,
        level: formData.level,
        status: formData.status,
        allowedPlans: formData.allowedPlans,
        isFeatured: formData.isFeatured,
      }

      let result: Course

      if (courseId) {
        // Modo edición
        result = await coursesService.updateWithImage(
          courseId,
          courseData,
          thumbnailFile ?? undefined
        )
      } else {
        // Modo creación
        result = await coursesService.createWithImage(
          courseData,
          thumbnailFile ?? undefined
        )
      }

      onSubmit?.(result)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al guardar el módulo"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedColor = coverColors.find((c) => c.id === formData.coverColor)
  const isEditing = Boolean(courseId)

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
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: Protocolos de Comunicación"
              required
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white font-medium outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <LinkIcon className="w-3 h-3" />
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="protocolos-de-comunicacion"
              required
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-slate-300 font-mono text-sm outline-none transition-all placeholder:text-slate-600"
            />
            <p className="text-xs text-slate-500">
              Se genera automáticamente desde el título. Puedes editarlo manualmente.
            </p>
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

      {/* Category & Level Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-600/20">
            <Tag className="w-5 h-5 text-violet-400" />
          </div>
          <h4 className="text-lg font-bold text-white">Categorización</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                handleChange("category", e.target.value as CourseCategory)
              }
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Nivel de Dificultad
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                handleChange("level", e.target.value as CourseLevel)
              }
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
            >
              {levelOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <h4 className="text-lg font-bold text-white">Acceso y Configuración</h4>
        </div>

        {/* Allowed Plans */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Planes con Acceso *
          </label>
          <div className="flex flex-wrap gap-3">
            {planOptions.map((plan) => (
              <button
                key={plan.value}
                type="button"
                onClick={() => handlePlanToggle(plan.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                  formData.allowedPlans.includes(plan.value)
                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                )}
              >
                {formData.allowedPlans.includes(plan.value) && (
                  <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
                )}
                {plan.label}
              </button>
            ))}
          </div>
          {formData.allowedPlans.length === 0 && (
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Selecciona al menos un plan
            </p>
          )}
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

          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value as CourseStatus)
              }
              className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
            >
              <option value={CourseStatus.DRAFT} className="bg-slate-900">
                Borrador
              </option>
              <option value={CourseStatus.PUBLISHED} className="bg-slate-900">
                Publicado
              </option>
              <option value={CourseStatus.ARCHIVED} className="bg-slate-900">
                Archivado
              </option>
            </select>
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => handleChange("isFeatured", !formData.isFeatured)}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors",
              formData.isFeatured ? "bg-blue-600" : "bg-slate-700"
            )}
          >
            <span
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                formData.isFeatured ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
          <div>
            <p className="text-sm font-medium text-white">Módulo Destacado</p>
            <p className="text-xs text-slate-400">
              Aparecerá en la sección de destacados del dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

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
          disabled={
            isLoading ||
            !formData.title.trim() ||
            !formData.slug.trim() ||
            formData.allowedPlans.length === 0
          }
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEditing ? "Guardando..." : "Creando..."}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? "Guardar Cambios" : "Crear Módulo"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
