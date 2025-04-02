// Team related interfaces

export interface Groupement {
  code: string;
  libelle: string;
  direction?: string;
}

export interface Personne {
  identifiant: string;
  nom: string;
  prenom: string;
  poste?: string;
  equipe?: Team;
}

export interface Team {
  code: string;
  nom: string;
  description?: string;
  groupement?: Groupement;
  membres?: Personne[];
}

// Request types based on Swagger spec
export interface CreateTeamRequest {
  code: string;
  nom: string;
  description?: string;
  groupementCode: string;
}

export interface UpdateTeamRequest {
  nom?: string;
  description?: string;
  groupementCode?: string;
}