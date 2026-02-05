import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  highlight?: boolean
  className?: string
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  highlight,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "glass-effect rounded-2xl p-6 relative overflow-hidden group",
        highlight && "border-l-4 border-l-blue-600/40",
        className
      )}
    >
      {/* Background Icon */}
      <div className="stat-card-icon">
        <Icon className="w-16 h-16 text-white" />
      </div>

      {/* Content */}
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <div className="flex items-end gap-3 mt-1">
        <h3 className="text-4xl font-black tracking-tight text-white">
          {value}
        </h3>
        {trend && (
          <span
            className={cn(
              "text-sm font-bold pb-1 flex items-center gap-0.5",
              trend.isPositive ? "text-emerald-500" : "text-orange-500"
            )}
          >
            <svg
              className={cn("w-4 h-4", !trend.isPositive && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            {trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}
