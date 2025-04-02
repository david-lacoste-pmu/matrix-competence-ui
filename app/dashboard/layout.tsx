import { ReactNode } from "react"
import { GalleryVerticalEnd, GridIcon, UsersRound, Network, UserRound } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardShell } from "@/components/dashboard-shell"

interface DashboardLayoutProps {
  children: ReactNode
}

const navItems = [
  {
    title: "Personnes",
    href: "/dashboard/personnes",
    icon: <UserRound className="mr-2 h-4 w-4" />,
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
  {
    title: "Groupements",
    href: "/dashboard/groupements",
    icon: <Network className="mr-2 h-4 w-4" />,
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar with navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 border-r bg-background">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <a href="/dashboard" className="font-medium truncate">
            Matrix de Compétences
          </a>
        </div>
        <DashboardNav items={navItems} />
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}