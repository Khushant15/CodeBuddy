import { Trophy } from "lucide-react"

interface XPBadgeProps {
  xp: number
  className?: string
}

export function XPBadge({ xp, className }: XPBadgeProps) {
  return (
    <div className={`xp-badge ${className}`}>
      <Trophy className="w-4 h-4 mr-1" />
      {xp} XP
    </div>
  )
}
