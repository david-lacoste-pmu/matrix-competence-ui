"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreatePersonneRequest } from "@/types/personne"
import { Team } from "@/types/team"

interface AddPersonneDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (personne: CreatePersonneRequest) => void
  teams: Team[]
}

export function AddPersonneDialog({ isOpen, onClose, onSave, teams }: AddPersonneDialogProps) {
  const [newPersonne, setNewPersonne] = useState<CreatePersonneRequest>({
    identifiant: "",
    nom: "",
    prenom: "",
    poste: "",
    equipeId: undefined
  })

  const [errors, setErrors] = useState({
    identifiant: false,
    nom: false,
    prenom: false
  })

  const handleInputChange = (field: keyof CreatePersonneRequest, value: string) => {
    setNewPersonne({ ...newPersonne, [field]: value })
    
    // Clear validation error when user types
    if (field in errors) {
      setErrors({ ...errors, [field]: false })
    }
  }

  const handleSubmit = () => {
    // Validate required fields
    const newErrors = {
      identifiant: !newPersonne.identifiant,
      nom: !newPersonne.nom,
      prenom: !newPersonne.prenom
    }
    
    setErrors(newErrors)
    
    // If any validation error, don't submit
    if (Object.values(newErrors).some(Boolean)) {
      return
    }
    
    onSave(newPersonne)
    resetForm()
  }
  
  const resetForm = () => {
    setNewPersonne({
      identifiant: "",
      nom: "",
      prenom: "",
      poste: "",
      equipeId: undefined
    })
    setErrors({
      identifiant: false,
      nom: false,
      prenom: false
    })
  }
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose()
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une personne</DialogTitle>
          <DialogDescription>
            Créer une nouvelle personne dans le système.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identifiant" className="text-right">
              Identifiant*
            </Label>
            <div className="col-span-3">
              <Input
                id="identifiant"
                value={newPersonne.identifiant}
                onChange={(e) => handleInputChange("identifiant", e.target.value)}
                className={errors.identifiant ? "border-red-500" : ""}
              />
              {errors.identifiant && (
                <p className="text-red-500 text-xs mt-1">L'identifiant est requis</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom*
            </Label>
            <div className="col-span-3">
              <Input
                id="nom"
                value={newPersonne.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                className={errors.nom ? "border-red-500" : ""}
              />
              {errors.nom && (
                <p className="text-red-500 text-xs mt-1">Le nom est requis</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prenom" className="text-right">
              Prénom*
            </Label>
            <div className="col-span-3">
              <Input
                id="prenom"
                value={newPersonne.prenom}
                onChange={(e) => handleInputChange("prenom", e.target.value)}
                className={errors.prenom ? "border-red-500" : ""}
              />
              {errors.prenom && (
                <p className="text-red-500 text-xs mt-1">Le prénom est requis</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="poste" className="text-right">
              Poste
            </Label>
            <Input
              id="poste"
              className="col-span-3"
              value={newPersonne.poste}
              onChange={(e) => handleInputChange("poste", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="equipe" className="text-right">
              Équipe
            </Label>
            <Select
              value={newPersonne.equipeId || "none"}
              onValueChange={(value) => handleInputChange("equipeId", value === "none" ? "" : value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune équipe</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.code} value={team.code}>
                    {team.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}