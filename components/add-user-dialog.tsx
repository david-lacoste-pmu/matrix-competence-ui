import { useEffect, useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { User } from "@/types/user"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface AddUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
}

export function AddUserDialog({ isOpen, onClose, onSave }: AddUserDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [formData, setFormData] = useState<User>({
    matricule: "",
    name: "",
    surname: "",
    habilitations: []
  })
  
  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        matricule: "",
        name: "",
        surname: "",
        habilitations: []
      })
    }
  }, [isOpen])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleSave = () => {
    if (formData.matricule && formData.name && formData.surname) {
      onSave(formData)
      setOpen(false)
      onClose()
    }
  }

  const handleHabilitationChange = (index: number, value: string) => {
    const updatedHabilitations = [...formData.habilitations]
    updatedHabilitations[index] = { id: value }
    
    setFormData({
      ...formData,
      habilitations: updatedHabilitations
    })
  }

  const addHabilitation = () => {    
    setFormData({
      ...formData,
      habilitations: [...formData.habilitations, { id: "" }]
    })
  }

  const removeHabilitation = (index: number) => {
    const updatedHabilitations = [...formData.habilitations]
    updatedHabilitations.splice(index, 1)
    
    setFormData({
      ...formData,
      habilitations: updatedHabilitations
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input 
              id="matricule" 
              value={formData.matricule} 
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
              placeholder="EMP12345"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input 
              id="surname" 
              value={formData.surname} 
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              placeholder="Doe"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Habilitations</Label>
              <button 
                type="button" 
                onClick={addHabilitation}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add
              </button>
            </div>
            
            {formData.habilitations.map((habilitation, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input 
                  value={habilitation.id} 
                  onChange={(e) => handleHabilitationChange(index, e.target.value)} 
                  placeholder="Habilitation ID"
                  className="flex-1"
                />
                <button 
                  type="button" 
                  onClick={() => removeHabilitation(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.matricule || !formData.name || !formData.surname} 
          >
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}