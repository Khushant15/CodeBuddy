import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface InfoCardProps {
  children: ReactNode
  className?: string
}

export function InfoCard({ children, className }: InfoCardProps) {
  return <div className={cn("neon-card", className)}>{children}</div>
}
