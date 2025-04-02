"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ApiUtilisateur } from "@/lib/auth-service"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Shield, UserCircle, Clock, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Personne } from "@/types/personne" 
import { PersonnesService } from "@/lib/personnes-service"

// Activity data mock - this would come from an API in a real scenario
const activityData = [
  {
    id: 1,
    action: "Updated team membership",
    date: "2 hours ago",
  },
  {
    id: 2,
    action: "Completed assessment for JavaScript competency",
    date: "Yesterday",
  },
  {
    id: 3,
    action: "Joined project Alpha",
    date: "3 days ago",
  },
]

export default function ProfilePage() {
  // Get user data directly from auth context
  const { user: authUser } = useAuth()
  
  const [personneDetails, setPersonneDetails] = useState<Personne | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (!authUser?.matricule) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch personne details for additional information
        try {
          const personneData = await PersonnesService.getPersonneById(authUser.matricule)
          setPersonneDetails(personneData)
        } catch (personneError) {
          console.error('Failed to fetch personne details:', personneError)
          // We don't set the main error here as the user data is more critical
        }
        
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        setError('Failed to load user profile. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDetails()
  }, [authUser?.matricule])
  
  // Calculate the initials from personne details or user data
  const getUserInitials = () => {
    if (personneDetails) {
      const nameInitial = personneDetails.nom && personneDetails.nom.charAt(0)
      const prenomInitial = personneDetails.prenom && personneDetails.prenom.charAt(0)
      
      if (nameInitial && prenomInitial) {
        return `${nameInitial}${prenomInitial}`.toUpperCase()
      } else if (nameInitial) {
        return nameInitial.toUpperCase()
      }
    }
    
    // Fallback to user matricule first character if available
    if (authUser?.matricule) {
      return authUser.matricule.charAt(0).toUpperCase()
    }
    
    return "U"
  }
  
  // Retrieve team info from personneDetails if available
  const teamInfo = personneDetails?.equipe ? {
    name: personneDetails.equipe.nom,
    code: personneDetails.equipe.code,
    description: personneDetails.equipe.description || ""
  } : null
  
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérer vos informations personnelles et paramètres.
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Erreur</h3>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Profile Overview Card */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle>Information Utilisateur</CardTitle>
                  <CardDescription>
                    Informations principales de votre profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-2xl font-semibold text-primary-foreground">
                      {getUserInitials()}
                    </div>
                    <div>
                      {personneDetails ? (
                        <h2 className="text-xl font-bold">
                          {personneDetails.prenom} {personneDetails.nom}
                        </h2>
                      ) : (
                        <h2 className="text-xl font-bold">
                          Utilisateur {authUser?.matricule}
                        </h2>
                      )}
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>Matricule: {authUser?.matricule || "—"}</span>
                      </div>
                      {personneDetails?.poste && (
                        <div className="text-sm text-primary font-medium flex items-center gap-2 mt-1">
                          {personneDetails.poste}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Informations supplémentaires</h3>
                    <dl className="grid grid-cols-1 gap-3 text-sm">
                      {teamInfo && (
                        <div className="grid grid-cols-2">
                          <dt className="text-muted-foreground">Équipe</dt>
                          <dd className="font-medium">{teamInfo.name}</dd>
                        </div>
                      )}
                      <div className="grid grid-cols-2">
                        <dt className="text-muted-foreground">Date d'inscription</dt>
                        <dd className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date().toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle>Habilitations</CardTitle>
                  <CardDescription>
                    Droits et autorisations système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {authUser?.habilitations && authUser.habilitations.length > 0 ? (
                      authUser.habilitations.map((habilitation, index) => (
                        <div key={index} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md">
                          <Shield className="h-3.5 w-3.5" />
                          <span className="text-sm font-medium">{habilitation.code || habilitation.description || ""}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Aucune habilitation attribuée</p>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="font-medium mb-3">Activités récentes</h3>
                  <div className="space-y-4">
                    {activityData.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="competences" className="w-full mt-2">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="competences">Compétences</TabsTrigger>
                <TabsTrigger value="teams">Équipes</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>
              
              <TabsContent value="competences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Compétences</CardTitle>
                    <CardDescription>
                      Compétences techniques et niveau de maîtrise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Sample competences - would come from API */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">JavaScript</h4>
                          <span className="text-xs font-medium text-primary">Avancé</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">React</h4>
                          <span className="text-xs font-medium text-primary">Intermédiaire</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">TypeScript</h4>
                          <span className="text-xs font-medium text-primary">Débutant</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="teams" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Équipes</CardTitle>
                    <CardDescription>
                      Équipes et projets auxquels vous appartenez
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {teamInfo ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between p-4 border rounded-md">
                          <div>
                            <h4 className="font-medium">{teamInfo.name}</h4>
                            <p className="text-sm text-muted-foreground">{teamInfo.description || "Pas de description disponible"}</p>
                          </div>
                          <Badge>Membre</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-muted-foreground">Vous n'appartenez à aucune équipe.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique d'activités</CardTitle>
                    <CardDescription>
                      Vos actions récentes dans le système
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[...activityData, 
                        { id: 4, action: "Participated in team meeting", date: "1 week ago" },
                        { id: 5, action: "Updated personal information", date: "2 weeks ago" },
                        { id: 6, action: "Completed annual review", date: "1 month ago" }
                      ].map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <Clock className="h-4 w-4 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardShell>
  )
}