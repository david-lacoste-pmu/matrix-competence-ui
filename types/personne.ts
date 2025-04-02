import { Team } from "./team";

export interface Personne {
  identifiant: string;
  nom: string;
  prenom: string;
  poste: string;
  equipe?: Team;
}

export interface CreatePersonneRequest {
  identifiant: string;
  nom: string;
  prenom: string;
  poste: string;
  equipeId?: string;
}

export interface UpdatePersonneRequest {
  nom?: string;
  prenom?: string;
  poste?: string;
  equipeId?: string;
}