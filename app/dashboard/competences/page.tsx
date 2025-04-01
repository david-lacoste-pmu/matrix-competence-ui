import { Metadata } from "next"

import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Competences",
  description: "Manage competences in the Matrix de Competences system",
}

export default function CompetencesPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competences</h1>
          <p className="text-muted-foreground">
            View and manage competence matrices for the organization.
          </p>
        </div>
        <div className="rounded-lg border">
          {/* Competences grid or list would go here */}
          <div className="p-6 text-center text-sm">
            Competence matrix functionality will be implemented here.
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}