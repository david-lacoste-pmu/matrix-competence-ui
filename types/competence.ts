import { Personne } from "./team";

export interface Note {
  id: string;
  valeur: number;
  libelle: string;
}

export interface Competence {
  id: string;
  libelle: string;
  description?: string;
  categorie?: string;
}

export interface MatriceCompetence {
  personne: Personne;
  competence: Competence;
  note: Note;
}