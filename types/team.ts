// Team related interfaces

export interface Groupement {
  // Add properties based on your schema
  id: string;
  name: string;
}

export interface Personne {
  // We'll use our existing User type as a base
  matricule: string;
  name: string;
  surname: string;
}

export interface Team {
  code: string;
  nom: string;
  description: string;
  groupement?: Groupement;
  membres: Personne[];
}