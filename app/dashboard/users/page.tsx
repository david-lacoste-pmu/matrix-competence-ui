import { Metadata } from "next"

import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users in the Matrix de Competences system",
}

export default function UsersPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions in the system.
          </p>
        </div>
        <div className="rounded-lg border">
          {/* User table or list would go here */}
          <div className="p-6 text-center text-sm">
            User management functionality will be implemented here.
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}