"use client"

import { useState } from "react"
import Link from "next/link"
import {
  QuestionsSidebar,
  QuestionEditor,
  QuizSettingsSidebar,
} from "@/components/dashboard/quiz"
import { ArrowLeft, FileQuestion, Pencil, Save } from "lucide-react"

/* ===== Types ===== */
interface AnswerOption {
  id: string
  text: string
  feedback: string
  isCorrect: boolean
}

interface Question {
  id: string
  number: number
  text: string
  type: "multiple_choice" | "true_false" | "short_answer"
  options: AnswerOption[]
}

interface QuizSettings {
  timeLimitMinutes: number
  passingScore: number
  randomOrder: boolean
  showResults: boolean
  allowRetries: boolean
}

interface Quiz {
  id: string
  title: string
  moduleId: string
  moduleName: string
  questions: Question[]
  settings: QuizSettings
  lastSaved?: string
}

/* ===== Mock Data ===== */
const mockQuiz: Quiz = {
  id: "QZ-001",
  title: "Conceptos Básicos de Ética",
  moduleId: "MOD-001",
  moduleName: "Protocolos de Comunicación",
  questions: [
    {
      id: "Q-001",
      number: 1,
      text: "¿Cuál es la primera regla de etiqueta al iniciar un show?",
      type: "multiple_choice",
      options: [
        {
          id: "opt-1",
          text: "Saludar cordialmente y sonreír a la cámara",
          feedback: "¡Exacto! La primera impresión es fundamental para retener al usuario.",
          isCorrect: true,
        },
        {
          id: "opt-2",
          text: "Esperar a que el usuario hable primero",
          feedback: "No es correcto. Como modelo, debes tomar la iniciativa.",
          isCorrect: false,
        },
        {
          id: "opt-3",
          text: "Pedir tokens inmediatamente",
          feedback: "Esto se considera agresivo y puede ahuyentar a nuevos usuarios.",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q-002",
      number: 2,
      text: "Verdadero o Falso: El respeto mutuo es opcional si el usuario paga suficientes tokens.",
      type: "true_false",
      options: [
        {
          id: "opt-4",
          text: "Verdadero",
          feedback: "Incorrecto. El respeto siempre es obligatorio.",
          isCorrect: false,
        },
        {
          id: "opt-5",
          text: "Falso",
          feedback: "¡Correcto! El respeto mutuo nunca es negociable.",
          isCorrect: true,
        },
      ],
    },
    {
      id: "Q-003",
      number: 3,
      text: "¿Qué acción es considerada una falta grave en la plataforma?",
      type: "multiple_choice",
      options: [
        {
          id: "opt-6",
          text: "Compartir información personal de usuarios",
          feedback: "Correcto. Esto viola la privacidad y los términos de servicio.",
          isCorrect: true,
        },
        {
          id: "opt-7",
          text: "Tomar descansos durante el show",
          feedback: "No es una falta grave, aunque debe hacerse con moderación.",
          isCorrect: false,
        },
      ],
    },
    {
      id: "Q-004",
      number: 4,
      text: "Seleccione los 3 pilares del código de conducta profesional.",
      type: "multiple_choice",
      options: [
        { id: "opt-8", text: "Respeto", feedback: "", isCorrect: true },
        { id: "opt-9", text: "Profesionalismo", feedback: "", isCorrect: true },
        { id: "opt-10", text: "Seguridad", feedback: "", isCorrect: true },
        { id: "opt-11", text: "Velocidad", feedback: "", isCorrect: false },
      ],
    },
  ],
  settings: {
    timeLimitMinutes: 15,
    passingScore: 80,
    randomOrder: true,
    showResults: true,
    allowRetries: false,
  },
  lastSaved: "12:45",
}

/* ===== Page Component ===== */
export default function QuizMakerPage() {
  const [quiz, setQuiz] = useState<Quiz>(mockQuiz)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    mockQuiz.questions[0]?.id || ""
  )
  const [quizTitle, setQuizTitle] = useState(mockQuiz.title)

  const selectedQuestion = quiz.questions.find((q) => q.id === selectedQuestionId)

  const handleQuestionChange = (updatedQuestion: Question) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }))
  }

  const handleSettingsChange = (settings: QuizSettings) => {
    setQuiz((prev) => ({ ...prev, settings }))
  }

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `Q-${Date.now()}`,
      number: quiz.questions.length + 1,
      text: "",
      type: "multiple_choice",
      options: [
        { id: `opt-${Date.now()}-1`, text: "", feedback: "", isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: "", feedback: "", isCorrect: false },
      ],
    }
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
    setSelectedQuestionId(newQuestion.id)
  }

  const handleSave = () => {
    console.log("Saving quiz:", quiz)
  }

  // Calcular puntos totales
  const totalPoints = quiz.questions.length * 25 // 25 puntos por pregunta

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <Link
            href={`/dashboard/modules/${quiz.moduleId}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Constructor
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <FileQuestion className="w-5 h-5 text-amber-400" />
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-lg font-black tracking-tight text-white p-0 w-64 outline-none"
            />
            <Pencil className="w-3 h-3 text-slate-600" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Autosave Indicator */}
          {quiz.lastSaved && (
            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Autoguardado: {quiz.lastSaved}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cuestionario
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Questions Sidebar */}
        <QuestionsSidebar
          questions={quiz.questions.map((q) => ({
            id: q.id,
            number: q.number,
            text: q.text,
          }))}
          selectedQuestionId={selectedQuestionId}
          totalPoints={totalPoints}
          onSelectQuestion={setSelectedQuestionId}
          onAddQuestion={handleAddQuestion}
        />

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar">
          <div className="max-w-4xl mx-auto p-10">
            {selectedQuestion ? (
              <QuestionEditor
                question={{
                  id: selectedQuestion.id,
                  text: selectedQuestion.text,
                  type: selectedQuestion.type,
                  options: selectedQuestion.options,
                }}
                onChange={(updated) =>
                  handleQuestionChange({
                    ...selectedQuestion,
                    text: updated.text,
                    type: updated.type,
                    options: updated.options,
                  })
                }
              />
            ) : (
              <div className="glass-effect rounded-2xl p-8 text-center">
                <p className="text-slate-400">
                  Selecciona una pregunta para editarla o crea una nueva.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Settings Sidebar */}
        <QuizSettingsSidebar
          settings={quiz.settings}
          moduleName={quiz.moduleName}
          onChange={handleSettingsChange}
        />
      </div>
    </div>
  )
}
