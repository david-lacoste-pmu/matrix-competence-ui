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
import { ArrowLeft, UserPlus, Edit } from "lucide-react"

export default function TeamDetailPage({ params }: { params: { code: string } }) {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${params.code}`);
        const data = await response.json();
        
        if (response.ok && data.team) {
          setTeam(data.team);
        } else {
          setError(data.error || 'Failed to fetch team');
        }
      } catch (err) {
        setError('An error occurred while fetching team data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeam();
  }, [params.code]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading team details...</p>
        </div>
      </DashboardShell>
    )
  }

  if (error || !team) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
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
                  <div>{team.description}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="font-semibold text-muted-foreground">Members:</div>
                  <div>{team.membres.length}</div>
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
                  <span className="text-4xl font-bold">{team.membres.length}</span>
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
            <Button size="sm" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.membres.map((member) => (
                    <TableRow key={member.matricule}>
                      <TableCell className="font-medium">{member.matricule}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.surname}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Team Member
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          Active
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            View
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Empty state if no members */}
              {team.membres.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32">
                  <p className="text-muted-foreground">No team members found</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}