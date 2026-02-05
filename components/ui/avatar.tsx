"use client"

import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
}

function Avatar({
  className,
  src,
  alt = "",
  fallback,
  size = "md",
  ...props
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-medium text-slate-600",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  )
}

export { Avatar }
