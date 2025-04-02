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
import { Groupement } from "@/types/groupement"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddGroupementDialog } from "@/components/add-groupement-dialog"
import { EditGroupementDialog } from "@/components/edit-groupement-dialog"
import { GroupementService } from "@/lib/api-service"
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

export default function GroupementsPage() {
  const [groupements, setGroupements] = useState<Groupement[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentGroupement, setCurrentGroupement] = useState<Groupement | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [groupementToDelete, setGroupementToDelete] = useState<Groupement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch groupements data from API
  useEffect(() => {
    const fetchGroupements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await GroupementService.getAllGroupements();
        setGroupements(data);
      } catch (error) {
        console.error('Failed to fetch groupements:', error);
        setError("Erreur lors du chargement des groupements. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroupements();
  }, []);

  const handleAddGroupement = async (newGroupement: Groupement) => {
    try {
      setError(null);
      const createdGroupement = await GroupementService.createGroupement(newGroupement);
      setGroupements([...groupements, createdGroupement]);
    } catch (error) {
      console.error('Failed to add groupement:', error);
      setError("Erreur lors de la création du groupement.");
    }
  }

  const handleEditClick = (groupement: Groupement) => {
    setCurrentGroupement({...groupement});
    setIsEditDialogOpen(true);
  }

  const handleUpdateGroupement = async (updatedGroupement: Groupement) => {
    try {
      setError(null);
      const result = await GroupementService.updateGroupement(
        updatedGroupement.code, 
        {
          libelle: updatedGroupement.libelle,
          direction: updatedGroupement.direction
        }
      );
      
      setGroupements(groupements.map(g => 
        g.code === updatedGroupement.code ? result : g
      ));
    } catch (error) {
      console.error('Failed to update groupement:', error);
      setError("Erreur lors de la mise à jour du groupement.");
    }
  }

  const handleDeleteClick = (groupement: Groupement) => {
    setGroupementToDelete(groupement);
    setDeleteAlertOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!groupementToDelete) return;
    
    try {
      setError(null);
      await GroupementService.deleteGroupement(groupementToDelete.code);
      setGroupements(groupements.filter(g => g.code !== groupementToDelete.code));
      setDeleteAlertOpen(false);
      setGroupementToDelete(null);
    } catch (error) {
      console.error('Failed to delete groupement:', error);
      setError("Erreur lors de la suppression du groupement.");
      setDeleteAlertOpen(false);
    }
  }

  const handleRetryFetch = () => {
    const fetchGroupements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await GroupementService.getAllGroupements();
        setGroupements(data);
      } catch (error) {
        console.error('Failed to fetch groupements:', error);
        setError("Erreur lors du chargement des groupements. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroupements();
  };

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Groupements</h1>
            <p className="text-muted-foreground">
              Create and manage organizational groupements
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Groupement
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetryFetch}
              >
                Retry
              </Button>
            </div>
          </div>
        )}
        
        <div className="rounded-lg border">
          {isLoading ? (
            <div className="p-4 text-center">Loading groupements...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No groupements found. Click the "Create Groupement" button to add one.
                    </TableCell>
                  </TableRow>
                ) : (
                  groupements.map((groupement) => (
                    <TableRow key={groupement.code}>
                      <TableCell className="font-medium">{groupement.code}</TableCell>
                      <TableCell>{groupement.libelle}</TableCell>
                      <TableCell>{groupement.direction}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button 
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditClick(groupement)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-sm text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteClick(groupement)}
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      <AddGroupementDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddGroupement}
      />
      
      <EditGroupementDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        groupement={currentGroupement}
        onSave={handleUpdateGroupement}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this groupement?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the groupement
              {groupementToDelete && (
                <span className="font-medium"> {groupementToDelete.libelle} ({groupementToDelete.code})</span>
              )}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}