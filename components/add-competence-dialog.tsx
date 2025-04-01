import { useEffect, useState } from "react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MatriceCompetence, Competence, Note } from "@/types/competence"
import { Personne } from "@/types/team"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface AddCompetenceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (matriceCompetence: MatriceCompetence) => void
  personnes: Personne[]
  competences: Competence[]
  notes: Note[]
  initialPersonne?: string
  initialCompetence?: string
}

export function AddCompetenceDialog({ 
  isOpen, 
  onClose, 
  onSave,
  personnes,
  competences,
  notes,
  initialPersonne = "",
  initialCompetence = ""
}: AddCompetenceDialogProps) {
  const [open, setOpen] = useState(isOpen)
  const [selectedPersonne, setSelectedPersonne] = useState<string>(initialPersonne)
  const [selectedCompetence, setSelectedCompetence] = useState<string>(initialCompetence)
  const [selectedNote, setSelectedNote] = useState<string>("")
  
  useEffect(() => {
    setOpen(isOpen)
    if (isOpen) {
      // Set initial values when dialog opens
      setSelectedPersonne(initialPersonne)
      setSelectedCompetence(initialCompetence)
    } else {
      // Reset form when dialog closes
      setSelectedPersonne("")
      setSelectedCompetence("")
      setSelectedNote("")
    }
  }, [isOpen, initialPersonne, initialCompetence])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose()
    }
  }

  const handleSave = () => {
    if (!selectedPersonne || !selectedCompetence || !selectedNote) {
      return
    }

    const personne = personnes.find(p => p.matricule === selectedPersonne)!
    const competence = competences.find(c => c.id === selectedCompetence)!
    const note = notes.find(n => n.id === selectedNote)!

    const newMatriceCompetence: MatriceCompetence = {
      personne,
      competence,
      note
    }
    
    onSave(newMatriceCompetence)
    setOpen(false)
    onClose()
  }

  const canSave = !!selectedPersonne && !!selectedCompetence && !!selectedNote

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Competence Evaluation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="personne">Person</Label>
            <Select 
              value={selectedPersonne} 
              onValueChange={setSelectedPersonne}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a person" />
              </SelectTrigger>
              <SelectContent>
                {personnes.map((personne) => (
                  <SelectItem key={personne.matricule} value={personne.matricule}>
                    {personne.name} {personne.surname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="competence">Competence</Label>
            <Select 
              value={selectedCompetence} 
              onValueChange={setSelectedCompetence}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a competence" />
              </SelectTrigger>
              <SelectContent>
                {competences.map((competence) => (
                  <SelectItem key={competence.id} value={competence.id}>
                    {competence.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Level</Label>
            <Select 
              value={selectedNote} 
              onValueChange={setSelectedNote}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                {notes.map((note) => (
                  <SelectItem key={note.id} value={note.id}>
                    {note.valeur} - {note.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!canSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}