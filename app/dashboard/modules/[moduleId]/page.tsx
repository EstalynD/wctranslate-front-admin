"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ModuleStructureSidebar,
  TaskTypeCards,
  ThemeEditor,
  AddTasksSection,
} from "@/components/dashboard/modules"
import { ArrowLeft, Eye, Send } from "lucide-react"

/* ===== Types ===== */
interface Task {
  id: string
  title: string
  type: "video" | "quiz" | "reading" | "upload"
}

interface Theme {
  id: string
  title: string
  description: string
  durationMinutes: number
  requiredLevel: "silver" | "gold" | "diamond"
  tasks: Task[]
}

interface Module {
  id: string
  title: string
  version: string
  themes: Theme[]
}

/* ===== Mock Data ===== */
const mockModule: Module = {
  id: "MOD-001",
  title: "Protocolos de Comunicación",
  version: "2.4.0",
  themes: [
    {
      id: "T-1028",
      title: "Bienvenida y Ética",
      description: "Introducción al programa y principios éticos fundamentales.",
      durationMinutes: 30,
      requiredLevel: "silver",
      tasks: [
        { id: "TK-001", title: "Video: Introducción", type: "video" },
        { id: "TK-002", title: "Quiz: Conceptos Básicos", type: "quiz" },
      ],
    },
    {
      id: "T-1029",
      title: "El Arte de la Conversación",
      description:
        "Este tema profundiza en las técnicas de storytelling y empatía necesarias para construir conexiones duraderas con los usuarios en el entorno digital de las transmisiones en vivo.",
      durationMinutes: 45,
      requiredLevel: "gold",
      tasks: [
        { id: "TK-003", title: "Lectura: Guión de Apertura", type: "reading" },
        { id: "TK-004", title: "Video: Manejo de Usuarios", type: "video" },
      ],
    },
    {
      id: "T-1030",
      title: "Cierre y Monetización",
      description: "Técnicas avanzadas para maximizar ingresos.",
      durationMinutes: 60,
      requiredLevel: "gold",
      tasks: [],
    },
  ],
}

/* ===== Page Component ===== */
export default function ModuleEditorPage() {
  const router = useRouter()
  const [module] = useState<Module>(mockModule)
  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    mockModule.themes[1]?.id || ""
  )
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    mockModule.themes[1]?.tasks[1]?.id || ""
  )

  const selectedTheme = module.themes.find((t) => t.id === selectedThemeId)

  const handleThemeChange = (updatedTheme: Theme) => {
    // TODO: Implementar actualización del tema
    console.log("Theme updated:", updatedTheme)
  }

  const handleAddTheme = () => {
    // TODO: Implementar añadir tema
    console.log("Add new theme")
  }

  const handleAddVideo = () => {
    console.log("Add video task")
  }

  const handleAddQuiz = () => {
    // Navegar al creador de quiz con un nuevo ID
    router.push(`/dashboard/modules/${module.id}/quiz/new`)
  }

  const handleAddUpload = () => {
    console.log("Add upload task")
  }

  const handleAddOther = () => {
    console.log("Add other task")
  }

  const handlePreview = () => {
    console.log("Preview module")
  }

  const handlePublish = () => {
    console.log("Publish module")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/modules"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase leading-none">
              Módulo: {module.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Editando última versión: {module.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
          >
            <Eye className="w-5 h-5" />
            Vista Previa
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            <Send className="w-5 h-5" />
            Publicar Módulo
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Structure Sidebar */}
        <ModuleStructureSidebar
          themes={module.themes}
          selectedThemeId={selectedThemeId}
          selectedTaskId={selectedTaskId}
          onSelectTheme={setSelectedThemeId}
          onSelectTask={(themeId, taskId) => {
            setSelectedThemeId(themeId)
            setSelectedTaskId(taskId)
          }}
          onAddTheme={handleAddTheme}
        />

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-10">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Theme Details */}
            {selectedTheme && (
              <ThemeEditor
                theme={{
                  id: selectedTheme.id,
                  title: selectedTheme.title,
                  description: selectedTheme.description,
                  durationMinutes: selectedTheme.durationMinutes,
                  requiredLevel: selectedTheme.requiredLevel,
                }}
                onChange={(updated) =>
                  handleThemeChange({ ...selectedTheme, ...updated })
                }
              />
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Add Tasks Section */}
            <div className="space-y-8 pb-10">
              <AddTasksSection />
              <TaskTypeCards
                onAddVideo={handleAddVideo}
                onAddQuiz={handleAddQuiz}
                onAddUpload={handleAddUpload}
                onAddOther={handleAddOther}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Autosave Indicator - Fixed at bottom of sidebar */}
      <div className="fixed bottom-24 left-4 w-56">
        <div className="glass-effect rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
            Modo Editor
          </p>
          <div className="flex justify-center items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-emerald-500 font-bold">
              Autoguardado activo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
