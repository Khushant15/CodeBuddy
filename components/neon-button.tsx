import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { forwardRef } from "react"

interface NeonButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "default" | "outline"
  size?: "sm" | "default" | "lg"
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          variant === "default" ? "neon-button" : "border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10",
          className,
        )}
        size={size}
        {...props}
      />
    )
  },
)

NeonButton.displayName = "NeonButton"
