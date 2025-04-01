import { Metadata } from "next"

import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Matrix de Competences dashboard overview",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Matrix de Competences dashboard.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard cards can go here */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium">Users</h3>
            <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium">Competences</h3>
            <p className="text-sm text-muted-foreground">View and manage competence matrices</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}