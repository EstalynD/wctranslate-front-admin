import { cn } from "@/lib/utils"

type BadgeVariant = "diamond" | "gold" | "silver" | "banned" | "success" | "warning" | "error" | "default"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  diamond: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  gold: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  silver: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  banned: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  error: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
