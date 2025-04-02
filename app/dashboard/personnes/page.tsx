"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Personne, CreatePersonneRequest, UpdatePersonneRequest } from "@/types/personne"
import { Team } from "@/types/team"
import { PersonnesService } from "@/lib/personnes-service"
import { TeamService } from "@/lib/api-service" // Import TeamService
import { AddPersonneDialog } from "@/components/add-personne-dialog"
import { EditPersonneDialog } from "@/components/edit-personne-dialog"
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
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PersonnesPage() {
  const [personnes, setPersonnes] = useState<Personne[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPersonne, setCurrentPersonne] = useState<Personne | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [personneToDelete, setPersonneToDelete] = useState<Personne | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Fetch personnes and teams data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch personnes
        const personnesData = await PersonnesService.getAllPersonnes()
        setPersonnes(personnesData)
        
        // Fetch teams from the API using TeamService
        const teamsData = await TeamService.getAllTeams()
        setTeams(teamsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleEditClick = (personne: Personne) => {
    setCurrentPersonne(personne)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (personne: Personne) => {
    setPersonneToDelete(personne)
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!personneToDelete) return
    
    try {
      await PersonnesService.deletePersonne(personneToDelete.identifiant)
      // Update the local state by removing the deleted personne
      setPersonnes(personnes.filter(p => p.identifiant !== personneToDelete.identifiant))
      setError(null)
    } catch (error) {
      console.error('Failed to delete personne:', error)
      setError('Failed to delete personne. Please try again.')
    } finally {
      setPersonneToDelete(null)
      setDeleteAlertOpen(false)
    }
  }

  const handleAddPersonne = async (newPersonne: CreatePersonneRequest) => {
    try {
      setError(null)
      // Adjust the equipeId if it's "none"
      const personneToCreate = {
        ...newPersonne,
        equipeId: newPersonne.equipeId === "none" ? "" : newPersonne.equipeId
      }
      
      const createdPersonne = await PersonnesService.createPersonne(personneToCreate)
      
      // If equipeId is selected and not "none", find the corresponding team and add it to the created personne
      if (personneToCreate.equipeId) {
        const team = teams.find(t => t.code === personneToCreate.equipeId)
        if (team) {
          createdPersonne.equipe = team
        }
      }
      
      // Add the new personne to the list
      setPersonnes([...personnes, createdPersonne])
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add personne:', error)
      setError('Failed to create personne. Please try again.')
    }
  }

  const handleUpdatePersonne = async (identifiant: string, updates: UpdatePersonneRequest) => {
    try {
      setError(null)
      // Adjust the equipeId if it's "none"
      const updatesToSend = {
        ...updates,
        equipeId: updates.equipeId === "none" ? "" : updates.equipeId
      }
      
      const updatedPersonne = await PersonnesService.updatePersonne(identifiant, updatesToSend)
      
      // If equipeId is selected and not "none", find the corresponding team and add it to the updated personne
      if (updatesToSend.equipeId) {
        const team = teams.find(t => t.code === updatesToSend.equipeId)
        if (team) {
          updatedPersonne.equipe = team
        }
      } else {
        // If equipeId is empty or "none", remove the team from the personne
        updatedPersonne.equipe = undefined
      }
      
      // Update the personne in the list
      setPersonnes(personnes.map(p => p.identifiant === identifiant ? updatedPersonne : p))
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update personne:', error)
      setError('Failed to update personne. Please try again.')
    }
  }
  
  // Filter personnes based on search term
  const filteredPersonnes = personnes.filter(personne => {
    if (!searchTerm) return true
    
    const searchTermLower = searchTerm.toLowerCase()
    return (
      personne.identifiant.toLowerCase().includes(searchTermLower) ||
      personne.nom.toLowerCase().includes(searchTermLower) ||
      personne.prenom.toLowerCase().includes(searchTermLower) ||
      (personne.poste && personne.poste.toLowerCase().includes(searchTermLower)) ||
      (personne.equipe?.nom && personne.equipe.nom.toLowerCase().includes(searchTermLower))
    )
  })

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personnes</h1>
            <p className="text-muted-foreground">
              Gérez les informations des personnes dans le système.
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Ajouter une personne
          </Button>
        </div>
        
        {error && (
          <div className="p-3 bg-destructive/15 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par nom, prénom, poste..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Chargement des données...</p>
                </div>
              ) : filteredPersonnes.length === 0 ? (
                <div className="p-8 text-center">
                  {searchTerm ? (
                    <p className="text-muted-foreground">Aucune personne ne correspond à votre recherche.</p>
                  ) : (
                    <p className="text-muted-foreground">Aucune personne trouvée. Ajoutez votre première personne !</p>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Identifiant</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Équipe</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPersonnes.map((personne) => (
                      <TableRow key={personne.identifiant}>
                        <TableCell className="font-medium">{personne.identifiant}</TableCell>
                        <TableCell>{personne.nom}</TableCell>
                        <TableCell>{personne.prenom}</TableCell>
                        <TableCell>{personne.poste || "-"}</TableCell>
                        <TableCell>
                          {personne.equipe ? (
                            <Badge variant="outline" className="bg-secondary/30">
                              {personne.equipe.nom}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <button 
                              className="text-sm text-primary hover:text-primary/80"
                              onClick={() => handleEditClick(personne)}
                            >
                              Modifier
                            </button>
                            <button 
                              className="text-sm text-destructive hover:text-destructive/80"
                              onClick={() => handleDeleteClick(personne)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddPersonneDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddPersonne}
        teams={teams}
      />
      
      <EditPersonneDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdatePersonne}
        personne={currentPersonne}
        teams={teams}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette personne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement
              {personneToDelete && (
                <span className="font-medium"> {personneToDelete.prenom} {personneToDelete.nom} ({personneToDelete.identifiant})</span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}