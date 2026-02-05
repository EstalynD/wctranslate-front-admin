"use client"

import { Plus, LucideIcon } from "lucide-react"

interface HeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    icon?: LucideIcon
    onClick?: () => void
    href?: string
  }
}

export function Header({ title, description, action }: HeaderProps) {
  const ActionIcon = action?.icon || Plus

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/5 shrink-0">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
        >
          <ActionIcon className="w-5 h-5" />
          {action.label}
        </button>
      )}
    </header>
  )
}
