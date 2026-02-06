"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Mail,
  Lock,
  User,
  Shield,
  Tv,
  CreditCard,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  usersService,
  platformsService,
  UserRole,
  UserStatus,
  UserStage,
  PlatformStatus,
  userRoleLabels,
  userStatusLabels,
  userStageLabels,
  type AdminCreateUserData,
  type UserModel,
  type Platform,
} from "@/lib/api"
import { PlanType, planTypeLabels } from "@/lib/api/users.service"

/* ===== Types ===== */
interface ModelFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  nickName: string
  role: UserRole
  status: UserStatus
  platformId: string // ID de la plataforma (ObjectId) o "" si ninguna
  planType: PlanType
  stage: UserStage
  isSuperUser: boolean
  isDemo: boolean
  studioId: string
}

interface ModelFormProps {
  onSubmit?: (user: UserModel) => void
  onCancel?: () => void
  className?: string
}

/* ===== Options ===== */
const roleOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: userRoleLabels[role],
}))

const statusOptions = Object.values(UserStatus).map((status) => ({
  value: status,
  label: userStatusLabels[status],
}))

const planOptions = Object.values(PlanType).map((plan) => ({
  value: plan,
  label: planTypeLabels[plan],
}))

const stageOptions = Object.values(UserStage).map((stage) => ({
  value: stage,
  label: userStageLabels[stage],
}))

/* ===== Valores por defecto ===== */
const defaultFormData: ModelFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  nickName: "",
  role: UserRole.MODEL,
  status: UserStatus.ACTIVE,
  platformId: "",
  planType: PlanType.FREE,
  stage: UserStage.INICIACION,
  isSuperUser: false,
  isDemo: false,
  studioId: "",
}

/* ===== Estilos reutilizables ===== */
const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"

const selectClass =
  "w-full bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all cursor-pointer"

const labelClass = "text-sm text-slate-300 font-medium flex items-center gap-2"

const sectionHeaderClass = "flex items-center gap-2 pb-2 border-b border-white/5"

/* ===== Componente ===== */
export function ModelForm({ onSubmit, onCancel, className }: ModelFormProps) {
  const [formData, setFormData] = useState<ModelFormData>(defaultFormData)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loadingPlatforms, setLoadingPlatforms] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Cargar plataformas desde la API al montar el componente
  useEffect(() => {
    async function fetchPlatforms() {
      try {
        const result = await platformsService.getAll({ limit: 100, status: PlatformStatus.ACTIVE })
        setPlatforms(result.data)
      } catch {
        console.error("Error al cargar plataformas")
      } finally {
        setLoadingPlatforms(false)
      }
    }
    fetchPlatforms()
  }, [])

  // Determina si el rol seleccionado es MODEL (para mostrar campos específicos)
  const isModelRole = formData.role === UserRole.MODEL

  const handleChange = <K extends keyof ModelFormData>(
    field: K,
    value: ModelFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validaciones
      if (!formData.email.trim()) {
        throw new Error("El email es requerido")
      }

      if (!formData.password || formData.password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (!formData.firstName.trim()) {
        throw new Error("El nombre es requerido")
      }

      if (!formData.lastName.trim()) {
        throw new Error("El apellido es requerido")
      }

      // Construir datos para el API
      const createData: AdminCreateUserData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        profile: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          nickName: formData.nickName.trim() || undefined,
        },
        role: formData.role,
        planType: formData.planType,
        stage: formData.stage,
        isSuperUser: formData.isSuperUser,
        isDemo: formData.isDemo,
        studioId: formData.studioId.trim() || undefined,
      }

      // Solo asignar plataforma si es MODEL y se seleccionó una
      if (isModelRole && formData.platformId) {
        createData.platformId = formData.platformId
      }

      const result = await usersService.create(createData)

      setSuccess(true)
      onSubmit?.(result.user)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al crear el usuario"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Mensaje de éxito */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400">
            Usuario creado correctamente
          </p>
        </div>
      )}

      {/* ===== Sección: Credenciales ===== */}
      <section className="space-y-6">
        <div className={sectionHeaderClass}>
          <Mail className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Credenciales de Acceso
          </h3>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className={labelClass}>
            <Mail className="w-4 h-4 text-slate-500" />
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="usuario@ejemplo.com"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password */}
          <div className="space-y-2">
            <label className={labelClass}>
              <Lock className="w-4 h-4 text-slate-500" />
              Contraseña <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={cn(inputClass, "pr-12")}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className={labelClass}>
              <Lock className="w-4 h-4 text-slate-500" />
              Confirmar Contraseña <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder="Repetir contraseña"
                className={cn(inputClass, "pr-12")}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Sección: Perfil ===== */}
      <section className="space-y-6">
        <div className={sectionHeaderClass}>
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Información del Perfil
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className={labelClass}>
              <User className="w-4 h-4 text-slate-500" />
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Ej: Valentina"
              className={inputClass}
              required
            />
          </div>

          {/* Apellido */}
          <div className="space-y-2">
            <label className={labelClass}>
              <User className="w-4 h-4 text-slate-500" />
              Apellido <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Ej: Ríos"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Nick Name */}
        <div className="space-y-2">
          <label className={labelClass}>
            <User className="w-4 h-4 text-slate-500" />
            Nombre Artístico
          </label>
          <input
            type="text"
            value={formData.nickName}
            onChange={(e) => handleChange("nickName", e.target.value)}
            placeholder="Nombre de perfil en plataforma (opcional)"
            className={inputClass}
          />
        </div>
      </section>

      {/* ===== Sección: Rol y Estado ===== */}
      <section className="space-y-6">
        <div className={sectionHeaderClass}>
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Rol y Estado
          </h3>
        </div>

        {/* Rol - Botones de selección */}
        <div className="space-y-2">
          <label className={labelClass}>
            <Shield className="w-4 h-4 text-slate-500" />
            Rol del Usuario <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("role", option.value)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-medium border transition-all",
                  formData.role === option.value
                    ? option.value === UserRole.MODEL
                      ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                      : option.value === UserRole.ADMIN
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {!isModelRole && (
            <p className="text-xs text-amber-400/70 mt-1">
              Los roles administrativos no tienen acceso a gamificación ni módulos de entrenamiento
            </p>
          )}
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label className={labelClass}>Estado</label>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("status", option.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  formData.status === option.value
                    ? option.value === UserStatus.ACTIVE
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : option.value === UserStatus.INACTIVE
                        ? "bg-slate-500/20 text-slate-400 border-slate-500/30"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Sección: Plataforma y Plan (solo para MODEL) ===== */}
      {isModelRole && (
        <section className="space-y-6">
          <div className={sectionHeaderClass}>
            <Tv className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Plataforma y Entrenamiento
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plataforma de Streaming */}
            <div className="space-y-2">
              <label className={labelClass}>
                <Tv className="w-4 h-4 text-slate-500" />
                Plataforma de Streaming
              </label>
              <select
                value={formData.platformId}
                onChange={(e) =>
                  handleChange("platformId", e.target.value)
                }
                className={selectClass}
                disabled={loadingPlatforms}
              >
                <option value="">
                  {loadingPlatforms ? "Cargando plataformas..." : "Sin plataforma (solo generales)"}
                </option>
                {platforms.map((platform) => (
                  <option key={platform._id} value={platform._id}>
                    {platform.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                {formData.platformId
                  ? "Se asignarán módulos de la plataforma + módulos generales"
                  : "Solo se asignarán módulos generales de entrenamiento"}
              </p>
            </div>

            {/* Etapa */}
            <div className="space-y-2">
              <label className={labelClass}>
                <Settings className="w-4 h-4 text-slate-500" />
                Etapa de Entrenamiento
              </label>
              <select
                value={formData.stage}
                onChange={(e) =>
                  handleChange("stage", e.target.value as UserStage)
                }
                className={selectClass}
              >
                {stageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* ===== Sección: Plan y Suscripción ===== */}
      <section className="space-y-6">
        <div className={sectionHeaderClass}>
          <CreditCard className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Plan de Suscripción
          </h3>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>
            <CreditCard className="w-4 h-4 text-slate-500" />
            Tipo de Plan
          </label>
          <div className="flex flex-wrap gap-3">
            {planOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("planType", option.value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  formData.planType === option.value
                    ? option.value === PlanType.ELITE
                      ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                      : option.value === PlanType.PRO
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : option.value === PlanType.FREE
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

      {/* ===== Sección: Opciones Avanzadas ===== */}
      <section className="space-y-6">
        <div className={sectionHeaderClass}>
          <Settings className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Opciones Avanzadas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Super User Toggle */}
          <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all">
            <input
              type="checkbox"
              checked={formData.isSuperUser}
              onChange={(e) => handleChange("isSuperUser", e.target.checked)}
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-600 focus:ring-offset-0"
            />
            <div>
              <p className="text-sm font-medium text-white">Super Usuario</p>
              <p className="text-xs text-slate-500">
                Acceso a todas las funcionalidades sin restricciones
              </p>
            </div>
          </label>

          {/* Demo Toggle */}
          <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all">
            <input
              type="checkbox"
              checked={formData.isDemo}
              onChange={(e) => handleChange("isDemo", e.target.checked)}
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-600 focus:ring-offset-0"
            />
            <div>
              <p className="text-sm font-medium text-white">Cuenta Demo</p>
              <p className="text-xs text-slate-500">
                Cuenta de demostración con datos de prueba
              </p>
            </div>
          </label>
        </div>

        {/* Studio ID */}
        <div className="space-y-2">
          <label className={labelClass}>
            <Settings className="w-4 h-4 text-slate-500" />
            ID del Estudio
          </label>
          <input
            type="text"
            value={formData.studioId}
            onChange={(e) => handleChange("studioId", e.target.value)}
            placeholder="ID del estudio asociado (opcional)"
            className={inputClass}
          />
          <p className="text-xs text-slate-500">
            Vincula este usuario a un estudio específico
          </p>
        </div>
      </section>

      {/* ===== Acciones ===== */}
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
              Creando Usuario...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Crear Usuario
            </>
          )}
        </button>
      </div>
    </form>
  )
}
