"use client"

import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

/* ===== Types ===== */
interface QuizSettings {
  timeLimitMinutes: number
  passingScore: number
  randomOrder: boolean
  showResults: boolean
  allowRetries: boolean
}

interface QuizSettingsSidebarProps {
  settings: QuizSettings
  moduleName?: string
  onChange?: (settings: QuizSettings) => void
  className?: string
}

/* ===== Toggle Component ===== */
interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  )
}

/* ===== Component ===== */
export function QuizSettingsSidebar({
  settings,
  moduleName,
  onChange,
  className,
}: QuizSettingsSidebarProps) {
  const handleChange = (key: keyof QuizSettings, value: number | boolean) => {
    onChange?.({ ...settings, [key]: value })
  }

  return (
    <aside className={cn("w-80 border-l border-white/5 flex flex-col bg-black/20 p-6 space-y-8", className)}>
      {/* Settings Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">
          Ajustes del Quiz
        </h3>

        <div className="space-y-6">
          {/* Time Limit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400">
                Tiempo Límite
              </label>
              <span className="text-xs font-bold text-blue-400">
                {settings.timeLimitMinutes} min
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={settings.timeLimitMinutes}
              onChange={(e) => handleChange("timeLimitMinutes", parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Passing Score Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400">
                Puntuación para Aprobar
              </label>
              <span className="text-xs font-bold text-rose-400">
                {settings.passingScore}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={settings.passingScore}
              onChange={(e) => handleChange("passingScore", parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Toggle Options */}
          <div className="pt-4 space-y-4 border-t border-white/5">
            <ToggleSwitch
              label="Orden Aleatorio"
              checked={settings.randomOrder}
              onChange={(v) => handleChange("randomOrder", v)}
            />
            <ToggleSwitch
              label="Mostrar Resultados"
              checked={settings.showResults}
              onChange={(v) => handleChange("showResults", v)}
            />
            <ToggleSwitch
              label="Permitir Reintentos"
              checked={settings.allowRetries}
              onChange={(v) => handleChange("allowRetries", v)}
            />
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {moduleName && (
        <div className="mt-auto p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h5 className="text-xs font-bold text-rose-400 uppercase">
              Resumen de Evaluación
            </h5>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Este cuestionario es obligatorio para completar el módulo "{moduleName}".
          </p>
        </div>
      )}
    </aside>
  )
}
