"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
  }
  icon?: LucideIcon
  iconColor?: string
  iconBgColor?: string
  className?: string
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-50",
  className,
}: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      {Icon && (
        <div className={cn("stat-card-icon", iconBgColor)}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      )}
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{title}</div>
      {change && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              change.type === "increase" && "text-emerald-600",
              change.type === "decrease" && "text-red-600",
              change.type === "neutral" && "text-slate-500"
            )}
          >
            {change.type === "increase" && "↑"}
            {change.type === "decrease" && "↓"}
            {change.value > 0 ? "+" : ""}
            {change.value}%
          </span>
          <span className="text-xs text-slate-400">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}

export { StatCard }
