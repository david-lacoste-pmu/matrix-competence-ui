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

interface EditUserDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (user: User) => void
}

export function EditUserDialog({ isOpen, onClose, user, onSave }: EditUserDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [formData, setFormData] = useState<User | null>(user)
  
  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (isOpen) {
      setFormData(user)
    }
  }, [isOpen, user])

  if (!formData) return null

  const handleSave = () => {
    if (formData) {
      onSave(formData)
      setOpen(false)
      onClose()
    }
  }
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleHabilitationChange = (index: number, value: string) => {
    if (!formData) return

    const updatedHabilitations = [...formData.habilitations]
    updatedHabilitations[index] = { id: value }
    
    setFormData({
      ...formData,
      habilitations: updatedHabilitations
    })
  }

  const addHabilitation = () => {
    if (!formData) return
    
    setFormData({
      ...formData,
      habilitations: [...formData.habilitations, { id: "" }]
    })
  }

  const removeHabilitation = (index: number) => {
    if (!formData) return
    
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
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input 
              id="surname" 
              value={formData.surname} 
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input 
              id="matricule" 
              value={formData.matricule} 
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
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
          <button
            type="button"
            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={handleSave}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}