import { ReactNode } from "react"
import { GalleryVerticalEnd, Users, GridIcon, UsersRound } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"

interface DashboardLayoutProps {
  children: ReactNode
}

const navItems = [
  {
    title: "Users",
    href: "/dashboard/users",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: <UsersRound className="mr-2 h-4 w-4" />,
  },
  {
    title: "Competences",
    href: "/dashboard/competences",
    icon: <GridIcon className="mr-2 h-4 w-4" />,
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <a href="/dashboard" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>Matrix de Competences</span>
        </a>
        <div className="ml-auto flex items-center gap-2">
          {/* User account dropdown could go here */}
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-background">
          <DashboardNav items={navItems} />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}