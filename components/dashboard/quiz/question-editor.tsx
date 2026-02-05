"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, MessageSquare, Trash2, Plus } from "lucide-react"

/* ===== Types ===== */
type QuestionType = "multiple_choice" | "true_false" | "short_answer"

interface AnswerOption {
  id: string
  text: string
  feedback: string
  isCorrect: boolean
}

interface QuestionData {
  id: string
  text: string
  type: QuestionType
  options: AnswerOption[]
}

interface QuestionEditorProps {
  question: QuestionData
  onChange?: (question: QuestionData) => void
  className?: string
}

/* ===== Question Type Labels ===== */
const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: "Selección Múltiple",
  true_false: "Verdadero / Falso",
  short_answer: "Respuesta Corta",
}

/* ===== Component ===== */
export function QuestionEditor({
  question,
  onChange,
  className,
}: QuestionEditorProps) {
  const handleTextChange = (text: string) => {
    onChange?.({ ...question, text })
  }

  const handleTypeChange = (type: QuestionType) => {
    onChange?.({ ...question, type })
  }

  const handleOptionChange = (optionId: string, field: keyof AnswerOption, value: string | boolean) => {
    const newOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, [field]: value } : opt
    )
    onChange?.({ ...question, options: newOptions })
  }

  const handleSetCorrect = (optionId: string) => {
    const newOptions = question.options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === optionId,
    }))
    onChange?.({ ...question, options: newOptions })
  }

  const handleDeleteOption = (optionId: string) => {
    const newOptions = question.options.filter((opt) => opt.id !== optionId)
    onChange?.({ ...question, options: newOptions })
  }

  const handleAddOption = () => {
    const newOption: AnswerOption = {
      id: `opt-${Date.now()}`,
      text: "",
      feedback: "",
      isCorrect: false,
    }
    onChange?.({ ...question, options: [...question.options, newOption] })
  }

  return (
    <div className={cn("glass-effect rounded-2xl p-8 border-white/10 space-y-8", className)}>
      {/* Question Text & Type */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Texto de la Pregunta
          </label>
          <textarea
            value={question.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Escribe aquí la pregunta..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white font-medium outline-none transition-all resize-none"
          />
        </div>
        <div className="w-full md:w-64 space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Tipo de Pregunta
          </label>
          <select
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
            className="w-full bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl px-4 py-3 text-white outline-none transition-all cursor-pointer"
          >
            {Object.entries(questionTypeLabels).map(([value, label]) => (
              <option key={value} value={value} className="bg-slate-900">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Answer Options */}
      {question.type !== "short_answer" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Opciones de Respuesta
            </h4>
            <span className="text-[10px] text-slate-500 italic">
              Marca el check verde para la respuesta correcta
            </span>
          </div>

          <div className="space-y-4">
            {question.options.map((option) => (
              <div
                key={option.id}
                className="group relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all focus-within:border-blue-600/50"
              >
                <div className="flex items-start gap-4">
                  {/* Correct Answer Toggle */}
                  <button
                    onClick={() => handleSetCorrect(option.id)}
                    className={cn(
                      "mt-2 size-6 rounded-full border-2 flex items-center justify-center transition-all",
                      option.isCorrect
                        ? "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                        : "border-white/10 text-transparent hover:border-emerald-500/50 hover:text-emerald-500/50"
                    )}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </button>

                  {/* Option Content */}
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, "text", e.target.value)}
                      placeholder="Texto de la opción..."
                      className="w-full bg-transparent border-none p-0 text-white font-medium focus:ring-0 outline-none"
                    />
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg">
                      <MessageSquare
                        className={cn(
                          "w-4 h-4",
                          option.isCorrect ? "text-blue-400" : "text-slate-500"
                        )}
                      />
                      <input
                        type="text"
                        value={option.feedback}
                        onChange={(e) => handleOptionChange(option.id, "feedback", e.target.value)}
                        placeholder="Feedback para esta respuesta..."
                        className="w-full bg-transparent border-none p-0 text-[11px] text-slate-400 focus:ring-0 outline-none"
                      />
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteOption(option.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Option Button */}
          <button
            onClick={handleAddOption}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-wider py-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir opción de respuesta
          </button>
        </div>
      )}
    </div>
  )
}
