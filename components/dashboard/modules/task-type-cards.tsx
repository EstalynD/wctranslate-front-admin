"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, Video, FileQuestion, Upload, Plus } from "lucide-react"

/* ===== Types ===== */
interface TaskTypeCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  hoverBorderColor: string
  onClick?: () => void
  className?: string
}

/* ===== Task Type Card ===== */
export function TaskTypeCard({
  title,
  description,
  icon: Icon,
  iconColor,
  hoverBorderColor,
  onClick,
  className,
}: TaskTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative glass-effect p-6 rounded-2xl border border-white/5 transition-all text-left overflow-hidden",
        hoverBorderColor,
        className
      )}
    >
      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-20 h-20" />
      </div>

      {/* Icon */}
      <div
        className={cn(
          "size-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
          iconColor.replace("text-", "bg-").replace("500", "500/20"),
          iconColor
        )}
      >
        <Icon className="w-7 h-7" />
      </div>

      {/* Content */}
      <h5 className="font-bold text-white">{title}</h5>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </button>
  )
}

/* ===== Predefined Task Cards ===== */
interface TaskTypeCardsProps {
  onAddVideo?: () => void
  onAddQuiz?: () => void
  onAddUpload?: () => void
  onAddOther?: () => void
}

export function TaskTypeCards({
  onAddVideo,
  onAddQuiz,
  onAddUpload,
  onAddOther,
}: TaskTypeCardsProps) {
  return (
    <div className="space-y-4">
      {/* Main Task Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskTypeCard
          title="Video Clase"
          description="Sube archivos MP4 o enlaza desde Vimeo/YouTube."
          icon={Video}
          iconColor="text-blue-500"
          hoverBorderColor="hover:border-blue-500/50"
          onClick={onAddVideo}
        />
        <TaskTypeCard
          title="Quiz Evaluativo"
          description="Crea preguntas de selección múltiple o verdadero/falso."
          icon={FileQuestion}
          iconColor="text-amber-500"
          hoverBorderColor="hover:border-amber-500/50"
          onClick={onAddQuiz}
        />
        <TaskTypeCard
          title="Subida de Archivo"
          description="Solicita tareas prácticas o documentos a la modelo."
          icon={Upload}
          iconColor="text-sky-500"
          hoverBorderColor="hover:border-sky-500/50"
          onClick={onAddUpload}
        />
      </div>

      {/* Other Tasks Card */}
      <button
        onClick={onAddOther}
        className="w-full glass-effect rounded-2xl p-6 border-dashed border-2 border-white/10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-white/[0.05] transition-colors group"
      >
        <div className="size-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-400">
          <Plus className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
            Otras Tareas
          </p>
          <p className="text-xs text-slate-600">
            Lectura, Enlace externo, Foro de debate
          </p>
        </div>
      </button>
    </div>
  )
}
