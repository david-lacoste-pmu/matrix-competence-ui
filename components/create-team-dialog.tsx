import { useEffect, useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Team, Groupement } from "@/types/team"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GroupementService } from "@/lib/api-service"

interface CreateTeamDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (team: Team) => void
}

export function CreateTeamDialog({ isOpen, onClose, onSave }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [formData, setFormData] = useState<Team>({
    code: "",
    nom: "",
    description: "",
  })
  const [groupements, setGroupements] = useState<Groupement[]>([])
  const [selectedGroupementCode, setSelectedGroupementCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch groupements when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchGroupements();
    }
  }, [isOpen]);

  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        code: "",
        nom: "",
        description: "",
      })
      setSelectedGroupementCode("")
      setError(null)
    }
  }, [isOpen])

  const fetchGroupements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await GroupementService.getAllGroupements();
      setGroupements(data);
    } catch (error) {
      console.error('Failed to fetch groupements:', error);
      setError("Une erreur est survenue lors du chargement des groupements.");
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

  const handleSave = () => {
    try {
      // Find the selected groupement
      const selectedGroupement = selectedGroupementCode 
        ? groupements.find(g => g.code === selectedGroupementCode) 
        : undefined;

      const newTeam: Team = {
        ...formData,
        groupement: selectedGroupement,
      }
      
      if (!newTeam.code || !newTeam.nom || !selectedGroupementCode) {
        setError("Les champs Code, Nom et Groupement sont obligatoires.");
        return;
      }
      
      onSave(newTeam)
      setOpen(false)
      onClose()
    } catch (error) {
      setError("Une erreur est survenue lors de la création de l'équipe.");
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Team Code<span className="text-red-500">*</span></Label>
              <Input 
                id="code" 
                value={formData.code} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="EQ001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nom">Team Name<span className="text-red-500">*</span></Label>
              <Input 
                id="nom" 
                value={formData.nom} 
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Backend Team"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description || ''} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Team responsible for backend development"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="groupement">Groupement<span className="text-red-500">*</span></Label>
            {isLoading ? (
              <div className="rounded-md border px-3 py-2 text-sm">Loading groupements...</div>
            ) : (
              <Select 
                value={selectedGroupementCode} 
                onValueChange={setSelectedGroupementCode}
              >
                <SelectTrigger id="groupement">
                  <SelectValue placeholder="Select a groupement" />
                </SelectTrigger>
                <SelectContent>
                  {groupements.map(groupement => (
                    <SelectItem key={groupement.code} value={groupement.code}>
                      {groupement.libelle} ({groupement.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-muted-foreground">Required field for creating a team</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mt-2">
            <p className="text-sm">
              <strong>Note:</strong> Team members can be added after the team is created.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.code || !formData.nom || !selectedGroupementCode} 
          >
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}