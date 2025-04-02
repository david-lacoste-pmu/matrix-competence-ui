import { Personne, CreatePersonneRequest, UpdatePersonneRequest } from "@/types/personne";

const API_BASE_URL = 'http://localhost:8080';

/**
 * Services pour la gestion des personnes
 */
export const PersonnesService = {
  /**
   * Récupérer toutes les personnes
   */
  async getAllPersonnes(): Promise<Personne[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/personnes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API personnes: ${response.status}`);
      }
      
      const personnes: Personne[] = await response.json();
      return personnes;
    } catch (error) {
      console.error('Erreur lors de la récupération des personnes:', error);
      throw error;
    }
  },
  
  /**
   * Récupérer une personne par son identifiant
   */
  async getPersonneById(identifiant: string): Promise<Personne> {
    try {
      const response = await fetch(`${API_BASE_URL}/personnes/${identifiant}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API personne: ${response.status}`);
      }
      
      const personne: Personne = await response.json();
      return personne;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la personne ${identifiant}:`, error);
      throw error;
    }
  },
  
  /**
   * Créer une nouvelle personne
   */
  async createPersonne(personne: CreatePersonneRequest): Promise<Personne> {
    try {
      const response = await fetch(`${API_BASE_URL}/personnes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personne)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la création de la personne: ${response.status}`);
      }
      
      const newPersonne: Personne = await response.json();
      return newPersonne;
    } catch (error) {
      console.error('Erreur lors de la création de la personne:', error);
      throw error;
    }
  },
  
  /**
   * Mettre à jour une personne
   */
  async updatePersonne(identifiant: string, personne: UpdatePersonneRequest): Promise<Personne> {
    try {
      const response = await fetch(`${API_BASE_URL}/personnes/${identifiant}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personne)
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de la personne: ${response.status}`);
      }
      
      const updatedPersonne: Personne = await response.json();
      return updatedPersonne;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la personne ${identifiant}:`, error);
      throw error;
    }
  },
  
  /**
   * Supprimer une personne
   */
  async deletePersonne(identifiant: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/personnes/${identifiant}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de la personne: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la personne ${identifiant}:`, error);
      throw error;
    }
  }
};