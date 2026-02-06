"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/dashboard/header"
import { DailyTasksCard } from "@/components/dashboard/settings/daily-tasks-card"
import { settingsService } from "@/lib/api"
import type { SystemSettings } from "@/lib/api"
import {
  Settings,
  RefreshCw,
  Clock,
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err) {
      setError("No se pudo cargar la configuración del sistema")
      console.error("Error cargando settings:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSettingsUpdate = (updated: SystemSettings) => {
    setSettings(updated)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Configuración"
          description="Configuración general del sistema"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-sm text-slate-400">Cargando configuración...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Configuración"
          description="Configuración general del sistema"
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="glass-effect rounded-2xl p-8 max-w-md text-center">
            <div className="size-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Error al cargar</h3>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <button
              onClick={fetchSettings}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Configuración"
        description="Configuración general del sistema WC Training"
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Info de última actualización */}
        {settings?.updatedAt && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Última actualización:{" "}
              {new Date(settings.updatedAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Secciones de Configuración */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tareas Diarias */}
          {settings && (
            <DailyTasksCard
              settings={settings}
              onUpdate={handleSettingsUpdate}
            />
          )}

          {/* Placeholder para futuras configuraciones */}
          <div className="glass-effect rounded-2xl p-6 border border-dashed border-white/10 flex flex-col items-center justify-center min-h-[280px]">
            <div className="size-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Settings className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">
              Más configuraciones próximamente
            </p>
            <p className="text-xs text-slate-600 text-center max-w-[240px]">
              Aquí se agregarán nuevas opciones de configuración del sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
