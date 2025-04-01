import { useEffect, useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Team, Personne } from "@/types/team"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface CreateTeamDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (team: Team) => void
}

// Sample users data - in a real app, this would come from an API
const availableUsers: User[] = [
  { 
    matricule: "EMP12345", 
    name: "John", 
    surname: "Doe",
    habilitations: [] 
  },
  { 
    matricule: "EMP67890", 
    name: "Jane", 
    surname: "Smith",
    habilitations: [] 
  },
  { 
    matricule: "EMP54321", 
    name: "Michael", 
    surname: "Johnson",
    habilitations: [] 
  },
]

export function CreateTeamDialog({ isOpen, onClose, onSave }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [formData, setFormData] = useState<Team>({
    code: "",
    nom: "",
    description: "",
    membres: []
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        code: "",
        nom: "",
        description: "",
        membres: []
      })
      setSelectedUsers([])
    }
  }, [isOpen])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleSave = () => {
    // Convert selected user IDs to actual user objects
    const teamMembers = selectedUsers.map(matricule => {
      const user = availableUsers.find(u => u.matricule === matricule)
      return user ? 
        { 
          matricule: user.matricule, 
          name: user.name, 
          surname: user.surname 
        } : 
        { matricule: "", name: "", surname: "" }
    }).filter(member => member.matricule !== "")

    const newTeam: Team = {
      ...formData,
      membres: teamMembers
    }
    
    onSave(newTeam)
    setOpen(false)
    onClose()
  }

  const toggleUserSelection = (matricule: string) => {
    if (selectedUsers.includes(matricule)) {
      setSelectedUsers(selectedUsers.filter(id => id !== matricule))
    } else {
      setSelectedUsers([...selectedUsers, matricule])
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Team Code</Label>
              <Input 
                id="code" 
                value={formData.code} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="EQ001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nom">Team Name</Label>
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
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Team responsible for backend development"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="max-h-60 overflow-y-auto rounded-md border p-2">
              {availableUsers.map((user) => (
                <div key={user.matricule} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                  <div 
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      selectedUsers.includes(user.matricule) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => toggleUserSelection(user.matricule)}
                  >
                    {selectedUsers.includes(user.matricule) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <label 
                    className="flex-grow cursor-pointer"
                    onClick={() => toggleUserSelection(user.matricule)}
                  >
                    {user.name} {user.surname} ({user.matricule})
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.code || !formData.nom} // Disable if required fields are empty
          >
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}