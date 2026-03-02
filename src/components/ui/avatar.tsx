import * as React from "react"
import { cn, getInitials } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  name: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
}

const colorPalette = [
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
]

function getColorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
  const initials = getInitials(name)
  const colorClass = getColorForName(name)

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden shrink-0",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-semibold shrink-0",
        sizeClasses[size],
        colorClass,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  )
}

export { Avatar }
