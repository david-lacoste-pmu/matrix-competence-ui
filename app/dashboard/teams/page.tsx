"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Team, Personne } from "@/types/team"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateTeamDialog } from "@/components/create-team-dialog"

// Sample data
const initialTeams: Team[] = [
  {
    code: "EQ001",
    nom: "Équipe Backend",
    description: "Équipe responsable du développement backend",
    membres: [
      { matricule: "EMP12345", name: "John", surname: "Doe" },
      { matricule: "EMP67890", name: "Jane", surname: "Smith" }
    ]
  },
  {
    code: "EQ002",
    nom: "Équipe Frontend",
    description: "Équipe responsable du développement frontend",
    membres: [
      { matricule: "EMP54321", name: "Michael", surname: "Johnson" }
    ]
  }
]

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

  const handleCreateTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam])
  }

  const handleEditClick = (team: Team) => {
    setCurrentTeam({...team, membres: [...team.membres]})
    setIsEditDialogOpen(true)
  }

  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams(teams.map(team => 
      team.code === updatedTeam.code ? updatedTeam : team
    ))
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
            <p className="text-muted-foreground">
              Create and manage teams in your organization
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Team
          </Button>
        </div>
        
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.code}>
                  <TableCell className="font-medium">{team.code}</TableCell>
                  <TableCell>{team.nom}</TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {team.membres.map((membre) => (
                        <span
                          key={membre.matricule}
                          className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                        >
                          {membre.name} {membre.surname}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditClick(team)}
                      >
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <CreateTeamDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateTeam}
      />
      
      {/* We can create an EditTeamDialog similar to the CreateTeamDialog if needed */}
      {/* <EditTeamDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        team={currentTeam}
        onSave={handleUpdateTeam}
      /> */}
    </DashboardShell>
  )
}