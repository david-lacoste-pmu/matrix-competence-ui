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

interface AddGroupementDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (groupement: Groupement) => void
}

export function AddGroupementDialog({ isOpen, onClose, onSave }: AddGroupementDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [formData, setFormData] = useState<Groupement>({
    code: "",
    libelle: "",
    direction: ""
  })
  
  // Sync the internal open state with the isOpen prop
  useEffect(() => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        code: "",
        libelle: "",
        direction: ""
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
    if (formData.code) {
      onSave(formData)
      setOpen(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Groupement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input 
              id="code" 
              value={formData.code} 
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="G001"
            />
            <p className="text-sm text-muted-foreground">
              A unique code for the groupement
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="libelle">Libellé</Label>
            <Input 
              id="libelle" 
              value={formData.libelle} 
              onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
              placeholder="Groupement IT"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <Input 
              id="direction" 
              value={formData.direction} 
              onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
              placeholder="Direction Informatique"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.code} 
          >
            Add Groupement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}