import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
}

function Sheet({ open, onOpenChange, children, side = "right" }: SheetProps) {
  if (!open) return null

  const sideClasses = {
    left: "inset-y-0 left-0 w-3/4 max-w-sm",
    right: "inset-y-0 right-0 w-3/4 max-w-sm",
    top: "inset-x-0 top-0",
    bottom: "inset-x-0 bottom-0",
  }

  const animateClasses = {
    left: "animate-in slide-in-from-left",
    right: "animate-in slide-in-from-right",
    top: "animate-in slide-in-from-top",
    bottom: "animate-in slide-in-from-bottom",
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "fixed z-50 bg-white shadow-lg border-l border-slate-200 p-6 overflow-y-auto",
          sideClasses[side],
          animateClasses[side]
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 mb-4", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />
}

export { Sheet, SheetHeader, SheetTitle }
