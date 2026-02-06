"use client"

import { useState } from "react"
import { settingsService } from "@/lib/api"
import type { SystemSettings } from "@/lib/api"
import {
  ListChecks,
  Pencil,
  Save,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Minus,
  Plus,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface DailyTasksCardProps {
  settings: SystemSettings
  onUpdate: (updated: SystemSettings) => void
}

export function DailyTasksCard({ settings, onUpdate }: DailyTasksCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Estado del formulario
  const [maxDailyTasks, setMaxDailyTasks] = useState(settings.dailyTasks.maxDailyTasks)
  const [enabled, setEnabled] = useState(settings.dailyTasks.enabled)

  const openEdit = () => {
    setMaxDailyTasks(settings.dailyTasks.maxDailyTasks)
    setEnabled(settings.dailyTasks.enabled)
    setError(null)
    setSuccess(false)
    setIsEditing(true)
  }

  const closeEdit = () => {
    setIsEditing(false)
    setError(null)
    setSuccess(false)
  }

  const handleSave = async () => {
    if (maxDailyTasks < 1 || maxDailyTasks > 100) {
      setError("El valor debe estar entre 1 y 100")
      return
    }

    try {
      setSaving(true)
      setError(null)
      const updated = await settingsService.updateSettings({
        dailyTasks: { maxDailyTasks, enabled },
      })
      onUpdate(updated)
      setSuccess(true)
      setTimeout(() => {
        closeEdit()
      }, 1200)
    } catch (err) {
      setError("Error al guardar la configuración")
      console.error("Error guardando settings:", err)
    } finally {
      setSaving(false)
    }
  }

  const increment = () => setMaxDailyTasks((prev) => Math.min(prev + 1, 100))
  const decrement = () => setMaxDailyTasks((prev) => Math.max(prev - 1, 1))

  return (
    <>
      {/* Card Principal */}
      <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
        {/* Indicador de estado */}
        <div className={`absolute top-0 left-0 w-full h-1 ${settings.dailyTasks.enabled ? "bg-blue-500" : "bg-slate-700"}`} />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`size-11 rounded-xl flex items-center justify-center ${settings.dailyTasks.enabled ? "bg-blue-600/20" : "bg-slate-700/50"}`}>
              <ListChecks className={`w-5 h-5 ${settings.dailyTasks.enabled ? "text-blue-400" : "text-slate-500"}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tareas Diarias</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Límite de lecciones por día para modelos
              </p>
            </div>
          </div>
          <button
            onClick={openEdit}
            className="size-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            title="Editar configuración"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Valor actual */}
        <div className="bg-white/5 rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Máximo por día
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tabular-nums">
                  {settings.dailyTasks.maxDailyTasks}
                </span>
                <span className="text-sm text-slate-400">
                  {settings.dailyTasks.maxDailyTasks === 1 ? "tarea" : "tareas"}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${settings.dailyTasks.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-600/20 text-slate-500"}`}>
              <div className={`size-2 rounded-full ${settings.dailyTasks.enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
              {settings.dailyTasks.enabled ? "Activo" : "Desactivado"}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-xs text-slate-500 leading-relaxed">
          {settings.dailyTasks.enabled
            ? `Cada modelo puede completar máximo ${settings.dailyTasks.maxDailyTasks} tarea(s) al día. El contador se reinicia automáticamente a medianoche.`
            : "El límite diario está desactivado. Las modelos pueden completar tareas sin restricción."}
        </p>
      </div>

      {/* Modal de Edición */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeEdit}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tareas Diarias</h3>
                  <p className="text-xs text-slate-400">Editar límite diario</p>
                </div>
              </div>
              <button
                onClick={closeEdit}
                className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body del Modal */}
            <div className="p-6 space-y-6">
              {/* Toggle Activar/Desactivar */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">Límite activo</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {enabled
                      ? "Las modelos tienen un tope diario"
                      : "Sin restricción de tareas diarias"}
                  </p>
                </div>
                <button
                  onClick={() => setEnabled(!enabled)}
                  className="flex items-center transition-colors"
                >
                  {enabled ? (
                    <ToggleRight className="w-10 h-10 text-blue-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-600" />
                  )}
                </button>
              </div>

              {/* Selector de cantidad */}
              <div className={`transition-opacity ${enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Máximo de tareas por día
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={decrement}
                    disabled={maxDailyTasks <= 1}
                    className="size-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="w-24 text-center">
                    <input
                      type="number"
                      value={maxDailyTasks}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val) && val >= 1 && val <= 100) {
                          setMaxDailyTasks(val)
                        }
                      }}
                      min={1}
                      max={100}
                      className="w-full text-center text-4xl font-black text-white bg-transparent border-none outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {maxDailyTasks === 1 ? "tarea" : "tareas"}
                    </p>
                  </div>

                  <button
                    onClick={increment}
                    disabled={maxDailyTasks >= 100}
                    className="size-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Barra visual */}
                <div className="mt-4 px-1">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(maxDailyTasks, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-slate-600">1</span>
                    <span className="text-[10px] text-slate-600">100</span>
                  </div>
                </div>
              </div>

              {/* Preview del cambio */}
              {(maxDailyTasks !== settings.dailyTasks.maxDailyTasks || enabled !== settings.dailyTasks.enabled) && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-300/80">
                    <p className="font-semibold mb-0.5">Cambios pendientes</p>
                    {maxDailyTasks !== settings.dailyTasks.maxDailyTasks && (
                      <p>Límite: {settings.dailyTasks.maxDailyTasks} → {maxDailyTasks} tareas</p>
                    )}
                    {enabled !== settings.dailyTasks.enabled && (
                      <p>Estado: {settings.dailyTasks.enabled ? "Activo" : "Inactivo"} → {enabled ? "Activo" : "Inactivo"}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              {/* Éxito */}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 font-semibold">
                    Configuración guardada correctamente
                  </p>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-white/5">
              <button
                onClick={closeEdit}
                disabled={saving}
                className="h-10 px-5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || success || (maxDailyTasks === settings.dailyTasks.maxDailyTasks && enabled === settings.dailyTasks.enabled)}
                className="h-10 px-5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
