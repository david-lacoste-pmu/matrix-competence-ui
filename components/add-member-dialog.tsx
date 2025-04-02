import { useEffect, useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Personne, Team } from "@/types/team"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, Search, AlertCircle } from "lucide-react"
import { PersonnesService } from "@/lib/personnes-service"

interface AddMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: (selectedMember: Personne) => Promise<void>
  team: Team
}

export function AddMemberDialog({ isOpen, onClose, onAddMember, team }: AddMemberDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [availablePersons, setAvailablePersons] = useState<Personne[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Personne | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch available persons when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailablePersons();
    }
  }, [isOpen, team]);

  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset state when dialog closes
      setSearchQuery("")
      setSelectedPerson(null)
      setError(null)
    }
  }, [isOpen])

  const fetchAvailablePersons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch real persons from the API
      const allPersons = await PersonnesService.getAllPersonnes();
      
      // Filter out persons already in the team
      const teamMemberIds = team.membres?.map(m => m.identifiant) || [];
      const filteredPersons = allPersons.filter(p => !teamMemberIds.includes(p.identifiant));
      
      setAvailablePersons(filteredPersons);
    } catch (error) {
      console.error('Failed to fetch available persons:', error);
      setError("Une erreur est survenue lors du chargement des personnes disponibles.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleAddMember = async () => {
    if (!selectedPerson) {
      setError("Veuillez sélectionner une personne à ajouter à l'équipe.");
      return;
    }

    try {
      setError(null);
      await onAddMember(selectedPerson);
      setOpen(false);
      onClose();
    } catch (error) {
      setError("Une erreur est survenue lors de l'ajout du membre à l'équipe.");
      console.error(error);
    }
  }

  const togglePersonSelection = (person: Personne) => {
    if (selectedPerson?.identifiant === person.identifiant) {
      setSelectedPerson(null);
    } else {
      setSelectedPerson(person);
    }
  }

  // Filter persons based on search query
  const filteredPersons = searchQuery 
    ? availablePersons.filter(person => 
        (person.nom && person.nom.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (person.prenom && person.prenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (person.identifiant && person.identifiant.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (person.poste && person.poste.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : availablePersons;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher une personne</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Rechercher par nom, identifiant ou poste"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Personnes disponibles</Label>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-primary"></div>
              </div>
            ) : filteredPersons.length > 0 ? (
              <div className="max-h-72 overflow-y-auto rounded-md border p-2">
                {filteredPersons.map((person) => (
                  <div 
                    key={person.identifiant} 
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer ${
                      selectedPerson?.identifiant === person.identifiant 
                        ? 'bg-primary/10' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => togglePersonSelection(person)}
                  >
                    <div 
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selectedPerson?.identifiant === person.identifiant 
                          ? 'bg-primary border-primary' 
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPerson?.identifiant === person.identifiant && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{person.prenom} {person.nom}</span>
                      <span className="text-xs text-muted-foreground">ID: {person.identifiant}</span>
                      {person.poste && (
                        <span className="text-xs text-primary">{person.poste}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md text-muted-foreground">
                {searchQuery 
                  ? "Aucune personne ne correspond à votre recherche."
                  : "Aucune personne disponible trouvée."}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleAddMember}
            disabled={!selectedPerson} 
          >
            Ajouter à l'équipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}