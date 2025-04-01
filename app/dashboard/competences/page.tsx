"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MatriceCompetence, Competence, Note } from "@/types/competence"
import { Personne } from "@/types/team"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddCompetenceDialog } from "@/components/add-competence-dialog"

// Sample notes data
const notes: Note[] = [
  { id: "N1", valeur: 1, libelle: "Débutant" },
  { id: "N2", valeur: 2, libelle: "Intermédiaire" },
  { id: "N3", valeur: 3, libelle: "Avancé" },
  { id: "N4", valeur: 4, libelle: "Expert" },
]

// Sample competences data
const competences: Competence[] = [
  { 
    id: "COMP001", 
    libelle: "JavaScript", 
    description: "Programmation en JavaScript",
    categorie: "Frontend"
  },
  { 
    id: "COMP002", 
    libelle: "React", 
    description: "Développement avec React",
    categorie: "Frontend"
  },
  { 
    id: "COMP003", 
    libelle: "Node.js", 
    description: "Développement backend avec Node.js",
    categorie: "Backend"
  },
  { 
    id: "COMP004", 
    libelle: "SQL", 
    description: "Requêtes et optimisation SQL",
    categorie: "Database"
  },
]

// Sample users data
const personnes: Personne[] = [
  { matricule: "EMP12345", name: "John", surname: "Doe" },
  { matricule: "EMP67890", name: "Jane", surname: "Smith" },
  { matricule: "EMP54321", name: "Michael", surname: "Johnson" },
]

// Sample MatriceCompetence data
const initialMatriceCompetences: MatriceCompetence[] = [
  {
    personne: personnes[0],
    competence: competences[0],
    note: notes[2],
  },
  {
    personne: personnes[0],
    competence: competences[1],
    note: notes[3],
  },
  {
    personne: personnes[1],
    competence: competences[0],
    note: notes[1],
  },
  {
    personne: personnes[1],
    competence: competences[2],
    note: notes[2],
  },
  {
    personne: personnes[2],
    competence: competences[3],
    note: notes[3],
  },
]

export default function CompetencesPage() {
  const [matriceCompetences, setMatriceCompetences] = useState<MatriceCompetence[]>(initialMatriceCompetences)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPersonne, setSelectedPersonne] = useState<string>("")
  const [selectedCompetence, setSelectedCompetence] = useState<string>("")

  const handleAddCompetence = (newMatriceCompetence: MatriceCompetence) => {
    // Check if a record already exists for this person and competence
    const exists = matriceCompetences.some(
      mc => 
        mc.personne.matricule === newMatriceCompetence.personne.matricule &&
        mc.competence.id === newMatriceCompetence.competence.id
    )

    if (exists) {
      // Update existing record
      setMatriceCompetences(
        matriceCompetences.map(mc => 
          (mc.personne.matricule === newMatriceCompetence.personne.matricule && 
           mc.competence.id === newMatriceCompetence.competence.id)
            ? newMatriceCompetence
            : mc
        )
      )
    } else {
      // Add new record
      setMatriceCompetences([...matriceCompetences, newMatriceCompetence])
    }
  }

  const openAddDialog = (personneId: string = "", competenceId: string = "") => {
    setSelectedPersonne(personneId);
    setSelectedCompetence(competenceId);
    setIsAddDialogOpen(true);
  };

  // Function to get a person's competence level
  const getCompetenceLevel = (personneId: string, competenceId: string) => {
    const match = matriceCompetences.find(
      mc => mc.personne.matricule === personneId && mc.competence.id === competenceId
    )
    return match ? match.note : null
  }

  // Group competences by category
  const competencesByCategory = competences.reduce<Record<string, Competence[]>>((acc, competence) => {
    const category = competence.categorie || "Autres"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(competence)
    return acc
  }, {})

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Competence Matrix</h1>
            <p className="text-muted-foreground">
              View and manage team members' competences
            </p>
          </div>
          <Button 
            onClick={() => openAddDialog()}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Competence
          </Button>
        </div>
        
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] sticky left-0 bg-white z-10">Person</TableHead>
                {competences.map((competence) => (
                  <TableHead key={competence.id} className="min-w-[120px]" title={competence.description}>
                    {competence.libelle}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnes.map((personne) => (
                <TableRow key={personne.matricule}>
                  <TableCell className="font-medium sticky left-0 bg-white">
                    {personne.name} {personne.surname}
                  </TableCell>
                  {competences.map((competence) => {
                    const competenceLevel = getCompetenceLevel(personne.matricule, competence.id)
                    return (
                      <TableCell key={competence.id}>
                        {competenceLevel ? (
                          <span 
                            className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              competenceLevel.valeur === 1 ? "bg-red-100 text-red-800" :
                              competenceLevel.valeur === 2 ? "bg-yellow-100 text-yellow-800" :
                              competenceLevel.valeur === 3 ? "bg-blue-100 text-blue-800" :
                              "bg-green-100 text-green-800"
                            }`}
                            title={competenceLevel.libelle}
                          >
                            {competenceLevel.valeur}
                          </span>
                        ) : (
                          <button 
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => openAddDialog(personne.matricule, competence.id)}
                          >
                            Add
                          </button>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Competence Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(competencesByCategory).map(([category, categoryCompetences]) => (
              <div key={category} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <ul className="space-y-1">
                  {categoryCompetences.map(comp => (
                    <li key={comp.id} className="text-sm">
                      {comp.libelle}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AddCompetenceDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setSelectedPersonne("");
          setSelectedCompetence("");
        }}
        onSave={handleAddCompetence}
        personnes={personnes}
        competences={competences}
        notes={notes}
        initialPersonne={selectedPersonne}
        initialCompetence={selectedCompetence}
      />
    </DashboardShell>
  )
}