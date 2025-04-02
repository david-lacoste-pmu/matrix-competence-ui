"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { EditTeamDialog } from "@/components/edit-team-dialog"
import { TeamService } from "@/lib/api-service"

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch teams data directly from backend API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await TeamService.getAllTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  const handleCreateTeam = async (newTeam: Team) => {
    try {
      const createdTeam = await TeamService.createTeam(newTeam);
      setTeams([...teams, createdTeam]);
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  }

  const handleEditClick = (e: React.MouseEvent, team: Team) => {
    e.stopPropagation(); // Prevent row click from triggering
    setCurrentTeam({...team, membres: [...team.membres]})
    setIsEditDialogOpen(true)
  }

  const handleRowClick = (team: Team) => {
    router.push(`/dashboard/teams/${team.code}`)
  }

  const handleUpdateTeam = async (updatedTeam: Team) => {
    try {
      await TeamService.updateTeam(updatedTeam.code, updatedTeam);
      setTeams(teams.map(team => 
        team.code === updatedTeam.code ? updatedTeam : team
      ));
    } catch (error) {
      console.error('Failed to update team:', error);
    }
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
          {isLoading ? (
            <div className="p-4 text-center">Loading teams...</div>
          ) : (
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
                  <TableRow 
                    key={team.code} 
                    onClick={() => handleRowClick(team)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
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
                    <TableCell onClick={e => e.stopPropagation()}>
                      <div className="flex space-x-2">
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={(e) => handleEditClick(e, team)}
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
          )}

          {/* Empty state if no teams */}
          {!isLoading && teams.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 p-4">
              <p className="text-muted-foreground">No teams found</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <CreateTeamDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateTeam}
      />
      
      <EditTeamDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        team={currentTeam}
        onSave={handleUpdateTeam}
      />
    </DashboardShell>
  )
}