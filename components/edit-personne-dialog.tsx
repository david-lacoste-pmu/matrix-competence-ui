"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Personne, UpdatePersonneRequest } from "@/types/personne"
import { Team } from "@/types/team"

interface EditPersonneDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (identifiant: string, updates: UpdatePersonneRequest) => void
  personne: Personne | null
  teams: Team[]
}

export function EditPersonneDialog({ isOpen, onClose, onSave, personne, teams }: EditPersonneDialogProps) {
  const [personneData, setPersonneData] = useState<UpdatePersonneRequest>({
    nom: "",
    prenom: "",
    poste: "",
    equipeId: undefined
  })

  const [errors, setErrors] = useState({
    nom: false,
    prenom: false
  })

  // Update form when personne changes
  useEffect(() => {
    if (personne) {
      setPersonneData({
        nom: personne.nom,
        prenom: personne.prenom,
        poste: personne.poste,
        equipeId: personne.equipe?.code || ""
      })
    }
  }, [personne])

  const handleInputChange = (field: keyof UpdatePersonneRequest, value: string) => {
    setPersonneData({ ...personneData, [field]: value })
    
    // Clear validation error when user types
    if (field in errors) {
      setErrors({ ...errors, [field]: false })
    }
  }

  const handleSubmit = () => {
    if (!personne) return
    
    // Validate required fields
    const newErrors = {
      nom: !personneData.nom,
      prenom: !personneData.prenom
    }
    
    setErrors(newErrors)
    
    // If any validation error, don't submit
    if (Object.values(newErrors).some(Boolean)) {
      return
    }

    // Prepare the data for submission
    const updatesForSubmit = {
      ...personneData,
      equipeId: personneData.equipeId === "none" ? "" : personneData.equipeId
    };
    
    onSave(personne.identifiant, updatesForSubmit)
  }
  
  if (!personne) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose()
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier une personne</DialogTitle>
          <DialogDescription>
            Modifier les informations de {personne.prenom} {personne.nom}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identifiant" className="text-right">
              Identifiant
            </Label>
            <Input
              id="identifiant"
              value={personne.identifiant}
              disabled
              className="col-span-3 bg-gray-100"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom*
            </Label>
            <div className="col-span-3">
              <Input
                id="nom"
                value={personneData.nom}
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
                value={personneData.prenom}
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
              value={personneData.poste || ""}
              onChange={(e) => handleInputChange("poste", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="equipe" className="text-right">
              Équipe
            </Label>
            <Select
              value={personneData.equipeId || "none"}
              onValueChange={(value) => handleInputChange("equipeId", value)}
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
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}