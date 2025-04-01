"use client"

import { useState, useMemo, useEffect } from "react"
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
import { PlusCircle, Search, Filter } from "lucide-react"
import { AddCompetenceDialog } from "@/components/add-competence-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

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
  {
    id: "COMP005",
    libelle: "Python",
    description: "Programmation en Python",
    categorie: "Backend"
  },
  {
    id: "COMP006",
    libelle: "Docker",
    description: "Containerisation avec Docker",
    categorie: "DevOps"
  },
  {
    id: "COMP007",
    libelle: "AWS",
    description: "Services cloud Amazon Web Services",
    categorie: "Cloud"
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
  {
    personne: personnes[0],
    competence: competences[4],
    note: notes[1],
  },
  {
    personne: personnes[2],
    competence: competences[5],
    note: notes[2],
  },
  {
    personne: personnes[1],
    competence: competences[6],
    note: notes[0],
  },
]

// Pre-compute categories to avoid hydration mismatch
const allCategories = (() => {
  const uniqueCategories = new Set<string>();
  competences.forEach(comp => {
    if (comp.categorie) {
      uniqueCategories.add(comp.categorie);
    }
  });
  return Array.from(uniqueCategories);
})();

// Pre-compute competences by category
const competencesByCategory = (() => {
  return competences.reduce<Record<string, Competence[]>>((acc, competence) => {
    const category = competence.categorie || "Autres"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(competence)
    return acc
  }, {});
})();

export default function CompetencesPage() {
  // Component state
  const [isClient, setIsClient] = useState(false)
  const [matriceCompetences, setMatriceCompetences] = useState<MatriceCompetence[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPersonne, setSelectedPersonne] = useState<string>("")
  const [selectedCompetence, setSelectedCompetence] = useState<string>("")
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedNoteValue, setSelectedNoteValue] = useState<string | null>(null)

  // Fix hydration mismatch by initializing state on client-side only
  useEffect(() => {
    setIsClient(true)
    setMatriceCompetences(initialMatriceCompetences)
  }, [])

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

  // Filter competences based on search criteria
  const filteredCompetences = useMemo(() => {
    if (!isClient) return competences; // Return all competences on server-side to prevent hydration mismatch
    
    return competences.filter(comp => {
      const matchesTerm = searchTerm === "" || 
        comp.libelle.toLowerCase().includes(searchTerm.toLowerCase()) || 
        comp.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || comp.categorie === selectedCategory;
      
      // Check if competence has any records with the selected note value
      let matchesNote = true;
      if (selectedNoteValue) {
        const noteValue = parseInt(selectedNoteValue);
        matchesNote = matriceCompetences.some(mc => 
          mc.competence.id === comp.id && mc.note.valeur === noteValue
        );
      }
      
      return matchesTerm && matchesCategory && matchesNote;
    });
  }, [competences, searchTerm, selectedCategory, selectedNoteValue, matriceCompetences, isClient]);

  // Reset all search filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedNoteValue(null);
  };

  // If not client-side yet, render a minimal version to avoid hydration mismatch
  if (!isClient) {
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
          </div>
          <div className="h-96 flex items-center justify-center">
            <p>Loading competence matrix...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

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
        
        {/* Search and filter controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Search Competences
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by technology or description"
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="text-sm font-medium mb-2 block">
                  Filter by Category
                </label>
                <Select 
                  value={selectedCategory || undefined} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {allCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="note" className="text-sm font-medium mb-2 block">
                  Filter by Competence Level
                </label>
                <Select 
                  value={selectedNoteValue || undefined} 
                  onValueChange={setSelectedNoteValue}
                >
                  <SelectTrigger id="note">
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any level</SelectItem>
                    {notes.map(note => (
                      <SelectItem key={note.id} value={note.valeur.toString()}>
                        {note.valeur} - {note.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchTerm || selectedCategory || selectedNoteValue) && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredCompetences.length} of {competences.length} competences
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] sticky left-0 bg-white z-10">Person</TableHead>
                {filteredCompetences.map((competence) => (
                  <TableHead key={competence.id} className="min-w-[120px]" title={competence.description}>
                    {competence.libelle}
                    {competence.categorie && (
                      <span className="block text-xs text-muted-foreground">
                        {competence.categorie}
                      </span>
                    )}
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
                  {filteredCompetences.map((competence) => {
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