import type React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { forwardRef } from "react"

interface TerminalInputProps extends React.ComponentProps<typeof Input> {}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(({ className, ...props }, ref) => {
  return <Input ref={ref} className={cn("terminal-input", className)} {...props} />
})

TerminalInput.displayName = "TerminalInput"
