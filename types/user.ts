export interface Habilitation {
  id: string;
  // You can add more properties later if needed
}

export interface User {
  matricule: string;
  name: string;
  surname: string;
  habilitations: Habilitation[];
}