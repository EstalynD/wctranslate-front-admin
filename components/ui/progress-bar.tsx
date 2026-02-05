import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: "sm" | "md"
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = "sm",
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn("w-full max-w-[120px]", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-slate-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
