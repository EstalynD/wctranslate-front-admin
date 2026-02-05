"use client"

import { cn } from "@/lib/utils"
import { GripVertical, PlusCircle } from "lucide-react"

/* ===== Types ===== */
interface Question {
  id: string
  number: number
  text: string
}

interface QuestionsSidebarProps {
  questions: Question[]
  selectedQuestionId?: string
  totalPoints?: number
  onSelectQuestion?: (id: string) => void
  onAddQuestion?: () => void
  className?: string
}

/* ===== Component ===== */
export function QuestionsSidebar({
  questions,
  selectedQuestionId,
  totalPoints = 100,
  onSelectQuestion,
  onAddQuestion,
  className,
}: QuestionsSidebarProps) {
  return (
    <aside className={cn("w-72 border-r border-white/5 flex flex-col bg-black/20", className)}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Preguntas ({questions.length})
        </h3>
        <span className="text-[10px] font-bold text-blue-400">
          Total: {totalPoints} pts
        </span>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar">
        {questions.map((question) => {
          const isSelected = selectedQuestionId === question.id

          return (
            <button
              key={question.id}
              onClick={() => onSelectQuestion?.(question.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all group",
                isSelected
                  ? "question-card-active border-white/10"
                  : "hover:bg-white/5 border-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase",
                    isSelected ? "text-blue-400" : "text-slate-500"
                  )}
                >
                  Pregunta {question.number}
                </span>
                <GripVertical className="w-3 h-3 text-slate-600 cursor-grab" />
              </div>
              <p
                className={cn(
                  "text-xs font-medium line-clamp-2",
                  isSelected ? "text-white" : "text-slate-400"
                )}
              >
                {question.text}
              </p>
            </button>
          )
        })}
      </div>

      {/* Add Question Button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onAddQuestion}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white hover:border-blue-600/50 hover:bg-blue-600/5 transition-all text-xs font-bold uppercase tracking-wider"
        >
          <PlusCircle className="w-4 h-4" />
          Añadir Pregunta
        </button>
      </div>
    </aside>
  )
}
