"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Edit, Trash2, AlertCircle } from "lucide-react"
import { TeamService } from "@/lib/api-service"
import { AddMemberDialog } from "@/components/add-member-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TeamDetailPage({ params }: { params: { code: string } }) {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<Personne | null>(null)

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TeamService.getTeamByCode(params.code);
      setTeam(data);
    } catch (err) {
      console.error('Failed to fetch team:', err);
      setError("Une erreur est survenue lors du chargement de l'équipe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [params.code]);

  const handleAddMember = async (member: Personne) => {
    if (!team) return;
    
    try {
      setError(null);
      
      // In a real implementation, you would call an API to add the member
      // For now, we'll update the local state and simulate success
      const updatedMembers = [...(team.membres || []), member];
      const updatedTeam = { ...team, membres: updatedMembers };
      
      // Here you would normally call an API endpoint to add the member
      // await TeamService.addMemberToTeam(team.code, member.identifiant);
      
      // Update the local state
      setTeam(updatedTeam);
      
    } catch (err) {
      console.error('Failed to add member:', err);
      setError("Une erreur est survenue lors de l'ajout du membre à l'équipe.");
      throw err;
    }
  };

  const handleRemoveMemberClick = (member: Personne) => {
    setMemberToRemove(member);
    setIsRemoveMemberDialogOpen(true);
  };

  const handleConfirmRemoveMember = async () => {
    if (!team || !memberToRemove) return;
    
    try {
      setError(null);
      
      // In a real implementation, you would call an API to remove the member
      // For now, we'll update the local state and simulate success
      const updatedMembers = team.membres?.filter(
        m => m.identifiant !== memberToRemove.identifiant
      ) || [];
      
      const updatedTeam = { ...team, membres: updatedMembers };
      
      // Here you would normally call an API endpoint to remove the member
      // await TeamService.removeMemberFromTeam(team.code, memberToRemove.identifiant);
      
      // Update the local state
      setTeam(updatedTeam);
      setIsRemoveMemberDialogOpen(false);
      setMemberToRemove(null);
      
    } catch (err) {
      console.error('Failed to remove member:', err);
      setError("Une erreur est survenue lors de la suppression du membre.");
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <p className="text-lg">Loading team details...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (error || !team) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-10 w-10 text-red-600" />
          <p className="text-lg text-red-600">{error || 'Team not found'}</p>
          <Button onClick={() => router.push("/dashboard/teams")}>
            Back to Teams
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/teams")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Details</h1>
            <p className="text-muted-foreground">
              View and manage team information
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Team information card */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>Details about the team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="font-semibold text-muted-foreground">Code:</div>
                  <div>{team.code}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="font-semibold text-muted-foreground">Name:</div>
                  <div>{team.nom}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="font-semibold text-muted-foreground">Description:</div>
                  <div>{team.description || <span className="text-muted-foreground italic">No description</span>}</div>
                </div>
                {team.groupement && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="font-semibold text-muted-foreground">Groupement:</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                        {team.groupement.libelle}
                      </span>
                      {team.groupement.direction && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {team.groupement.direction}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="font-semibold text-muted-foreground">Members:</div>
                  <div>{team.membres?.length || 0}</div>
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" className="mr-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member stats card */}
          <Card>
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
              <CardDescription>Overview of team composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                  <span className="text-4xl font-bold">{team.membres?.length || 0}</span>
                  <span className="text-sm text-muted-foreground">Total Members</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg">
                  <span className="text-4xl font-bold">-</span>
                  <span className="text-sm text-muted-foreground">Projects</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team members table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Members of {team.nom}</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="flex items-center"
              onClick={() => setIsAddMemberDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identifiant</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(team.membres && team.membres.length > 0) ? (
                    team.membres.map((member) => (
                      <TableRow key={member.identifiant}>
                        <TableCell className="font-medium">{member.identifiant}</TableCell>
                        <TableCell>{member.nom}</TableCell>
                        <TableCell>{member.prenom}</TableCell>
                        <TableCell>
                          {member.poste ? (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {member.poste}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Non spécifié</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              View
                            </button>
                            <button 
                              className="text-sm text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveMemberClick(member)}
                            >
                              Remove
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No team members found. Click "Add Member" to add someone to this team.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {team && (
        <AddMemberDialog
          isOpen={isAddMemberDialogOpen}
          onClose={() => setIsAddMemberDialogOpen(false)}
          onAddMember={handleAddMember}
          team={team}
        />
      )}
      
      <AlertDialog 
        open={isRemoveMemberDialogOpen} 
        onOpenChange={setIsRemoveMemberDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-medium">
                {memberToRemove?.prenom} {memberToRemove?.nom} ({memberToRemove?.identifiant})
              </span>{' '}
              from this team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToRemove(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemoveMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}