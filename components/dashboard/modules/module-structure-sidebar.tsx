"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  GripVertical,
  FolderOpen,
  Folder,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileQuestion,
  FileText,
  Video,
  PlusCircle,
} from "lucide-react"

/* ===== Types ===== */
type TaskType = "video" | "quiz" | "reading" | "upload"

interface Task {
  id: string
  title: string
  type: TaskType
}

interface Theme {
  id: string
  title: string
  tasks: Task[]
  isExpanded?: boolean
}

interface ModuleStructureSidebarProps {
  themes: Theme[]
  selectedThemeId?: string
  selectedTaskId?: string
  onSelectTheme?: (themeId: string) => void
  onSelectTask?: (themeId: string, taskId: string) => void
  onAddTheme?: () => void
  className?: string
}

/* ===== Task Icon Map ===== */
const taskIconMap: Record<TaskType, { icon: typeof PlayCircle; color: string }> = {
  video: { icon: PlayCircle, color: "text-emerald-400" },
  quiz: { icon: FileQuestion, color: "text-amber-400" },
  reading: { icon: FileText, color: "text-sky-400" },
  upload: { icon: Video, color: "text-blue-400" },
}

/* ===== Component ===== */
export function ModuleStructureSidebar({
  themes,
  selectedThemeId,
  selectedTaskId,
  onSelectTheme,
  onSelectTask,
  onAddTheme,
  className,
}: ModuleStructureSidebarProps) {
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(
    new Set(themes.map((t) => t.id))
  )

  const toggleTheme = (themeId: string) => {
    const newExpanded = new Set(expandedThemes)
    if (newExpanded.has(themeId)) {
      newExpanded.delete(themeId)
    } else {
      newExpanded.add(themeId)
    }
    setExpandedThemes(newExpanded)
  }

  return (
    <aside
      className={cn(
        "w-80 border-r border-white/5 flex flex-col bg-black/20",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
          Estructura del Módulo
        </h3>
        <button
          onClick={onAddTheme}
          className="text-blue-400 hover:text-white transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Themes List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 custom-scrollbar">
        {themes.map((theme, index) => {
          const isExpanded = expandedThemes.has(theme.id)
          const isSelected = selectedThemeId === theme.id

          return (
            <div key={theme.id} className="space-y-2">
              {/* Theme Header */}
              <div
                onClick={() => {
                  toggleTheme(theme.id)
                  onSelectTheme?.(theme.id)
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                  isSelected
                    ? "bg-blue-600/10 border border-blue-600/20"
                    : "hover:bg-white/5 border border-transparent hover:border-white/10"
                )}
              >
                <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                {isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                ) : (
                  <Folder className="w-5 h-5 text-slate-500" />
                )}
                <span
                  className={cn(
                    "text-sm font-bold truncate flex-1",
                    isSelected ? "text-white" : "text-slate-400"
                  )}
                >
                  {index + 1}. {theme.title}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Tasks List */}
              {isExpanded && theme.tasks.length > 0 && (
                <div className="pl-8 space-y-2 border-l border-blue-600/20 ml-4">
                  {theme.tasks.map((task) => {
                    const taskConfig = taskIconMap[task.type]
                    const TaskIcon = taskConfig.icon
                    const isTaskSelected = selectedTaskId === task.id

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask?.(theme.id, task.id)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group",
                          isTaskSelected
                            ? "bg-blue-600/20 border border-blue-600/30"
                            : "hover:bg-white/5 border border-transparent hover:border-white/5"
                        )}
                      >
                        <GripVertical className="w-4 h-4 text-slate-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                        <TaskIcon className={cn("w-4 h-4", taskConfig.color)} />
                        <span
                          className={cn(
                            "text-xs font-medium truncate",
                            isTaskSelected ? "text-white font-bold" : "text-slate-400"
                          )}
                        >
                          {task.title}
                        </span>
                        {isTaskSelected && (
                          <div className="ml-auto size-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
