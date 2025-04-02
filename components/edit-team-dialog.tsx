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

interface EditTeamDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (team: Team) => void
  team: Team | null
}

export function EditTeamDialog({ isOpen, onClose, onSave, team }: EditTeamDialogProps) {
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

  // Initialize form with team data when team prop changes or when dialog opens
  useEffect(() => {
    if (team && isOpen) {
      setFormData({
        code: team.code,
        nom: team.nom,
        description: team.description,
        groupement: team.groupement,
        membres: team.membres // Keep members in the data structure, but don't display for editing
      })
      
      // Set selected groupement
      if (team.groupement) {
        setSelectedGroupementCode(team.groupement.code);
      }
    }
  }, [team, isOpen])

  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (!isOpen && !team) {
      // Reset form when dialog closes
      resetForm();
    }
  }, [isOpen, team])

  const resetForm = () => {
    setFormData({
      code: "",
      nom: "",
      description: "",
    });
    setSelectedGroupementCode("");
    setError(null);
  };

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

      const updatedTeam: Team = {
        ...formData,
        groupement: selectedGroupement,
        // Keep existing members in the data
        membres: formData.membres
      }
      
      if (!updatedTeam.code || !updatedTeam.nom || !selectedGroupementCode) {
        setError("Les champs Code, Nom et Groupement sont obligatoires.");
        return;
      }
      
      onSave(updatedTeam)
      setOpen(false)
      onClose()
    } catch (error) {
      setError("Une erreur est survenue lors de la mise à jour de l'équipe.");
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
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
                disabled // Code should not be editable for existing teams
                className="bg-muted/50"
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
          </div>
          
          {formData.membres && formData.membres.length > 0 ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mt-2">
              <p className="text-sm">
                <strong>Note:</strong> This team currently has {formData.membres.length} member{formData.membres.length > 1 ? 's' : ''}. Team members can be managed from the team details page.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mt-2">
              <p className="text-sm">
                <strong>Note:</strong> Team members can be added from the team details page.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.nom || !selectedGroupementCode} 
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}