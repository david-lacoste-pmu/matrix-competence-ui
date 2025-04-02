"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"
import { LogOut, User, UserCircle } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface DashboardShellProps {
  children: ReactNode
  className?: string
}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  const { user, logout } = useAuth()
  
  return (
    <div className="flex flex-col h-full">
      {/* Header bar with user dropdown at top left */}
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 font-normal">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.matricule || "Utilisateur"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                {user && (
                  <DropdownMenuItem disabled className="text-sm opacity-70">
                    Matricule: {user.matricule}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Mon Profil</span>
                  </Link>
                </DropdownMenuItem>
                {user?.habilitations && user.habilitations.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Habilitations</DropdownMenuLabel>
                    {user.habilitations.map(hab => (
                      <DropdownMenuItem key={hab.code} disabled className="text-sm opacity-70">
                        {hab.description || hab.code}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <div className={cn("grid items-start gap-8", className)} {...props}>
          {children}
        </div>
      </main>
    </div>
  )
}