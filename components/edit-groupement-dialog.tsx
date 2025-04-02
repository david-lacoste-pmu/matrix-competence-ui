import { useEffect, useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Groupement } from "@/types/groupement"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface EditGroupementDialogProps {
  isOpen: boolean
  onClose: () => void
  groupement: Groupement | null
  onSave: (groupement: Groupement) => void
}

export function EditGroupementDialog({ 
  isOpen, 
  onClose, 
  groupement, 
  onSave 
}: EditGroupementDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [formData, setFormData] = useState<Groupement | null>(groupement)
  
  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (isOpen && groupement) {
      setFormData({...groupement})
    }
  }, [isOpen, groupement])

  if (!formData) return null

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleSave = () => {
    if (formData && formData.code) {
      onSave(formData)
      setOpen(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Groupement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input 
              id="code" 
              value={formData.code} 
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              readOnly // Code shouldn't be editable as it's the identifier
              className="bg-muted/50"
            />
            <p className="text-sm text-muted-foreground">
              The unique identifier for this groupement
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="libelle">Libellé</Label>
            <Input 
              id="libelle" 
              value={formData.libelle || ""} 
              onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
              placeholder="Groupement IT"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <Input 
              id="direction" 
              value={formData.direction || ""} 
              onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
              placeholder="Direction Informatique"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}