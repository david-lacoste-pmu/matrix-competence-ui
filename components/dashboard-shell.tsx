import { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: ReactNode
  className?: string
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  )
}