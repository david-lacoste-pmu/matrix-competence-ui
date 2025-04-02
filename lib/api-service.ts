// API Service pour accéder directement au backend
import { Team } from '@/types/team';
import { User, Habilitation } from '@/types/user';

// URL de base de l'API backend
const API_BASE_URL = 'http://localhost:8080';

// Type pour les personnes de l'API
interface ApiPersonne {
  identifiant: string;
  nom: string;
  prenom: string;
  poste?: string;
  equipe?: any;
}

// Type pour les équipes de l'API
interface ApiEquipe {
  code: string;
  nom: string;
  description?: string;
  groupement?: {
    code: string;
    libelle: string;
    direction?: string;
  };
  membres?: ApiPersonne[];
}

// Type pour les utilisateurs de l'API
interface ApiUtilisateur {
  matricule: string;
  habilitations?: {
    code: string;
    description?: string;
  }[];
}

/**
 * Services pour les équipes
 */
export const TeamService = {
  // Récupérer toutes les équipes
  async getAllTeams(): Promise<Team[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const equipes: ApiEquipe[] = await response.json();

      // Transformer les données au format attendu par l'application
      return equipes.map(equipe => ({
        code: equipe.code,
        nom: equipe.nom,
        description: equipe.description || '',
        groupement: equipe.groupement ? {
          id: equipe.groupement.code,
          name: equipe.groupement.libelle
        } : undefined,
        membres: equipe.membres?.map(membre => ({
          matricule: membre.identifiant,
          name: membre.nom,
          surname: membre.prenom
        })) || []
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
      throw error;
    }
  },

  // Récupérer une équipe par son code
  async getTeamByCode(code: string): Promise<Team> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipes/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Équipe non trouvée');
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const equipe: ApiEquipe = await response.json();

      // Transformer les données au format attendu par l'application
      return {
        code: equipe.code,
        nom: equipe.nom,
        description: equipe.description || '',
        groupement: equipe.groupement ? {
          id: equipe.groupement.code,
          name: equipe.groupement.libelle
        } : undefined,
        membres: equipe.membres?.map(membre => ({
          matricule: membre.identifiant,
          name: membre.nom,
          surname: membre.prenom
        })) || []
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'équipe ${code}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle équipe
  async createTeam(team: Team): Promise<Team> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: team.code,
          nom: team.nom,
          description: team.description,
          groupementCode: team.groupement?.id
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const createdEquipe: ApiEquipe = await response.json();

      // Retourner l'équipe créée
      return {
        code: createdEquipe.code,
        nom: createdEquipe.nom,
        description: createdEquipe.description || '',
        groupement: createdEquipe.groupement ? {
          id: createdEquipe.groupement.code,
          name: createdEquipe.groupement.libelle
        } : undefined,
        membres: createdEquipe.membres?.map(membre => ({
          matricule: membre.identifiant,
          name: membre.nom,
          surname: membre.prenom
        })) || []
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe:', error);
      throw error;
    }
  },

  // Mettre à jour une équipe
  async updateTeam(code: string, team: Partial<Team>): Promise<Team> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipes/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: team.nom,
          description: team.description,
          groupementCode: team.groupement?.id
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const updatedEquipe: ApiEquipe = await response.json();

      // Retourner l'équipe mise à jour
      return {
        code: updatedEquipe.code,
        nom: updatedEquipe.nom,
        description: updatedEquipe.description || '',
        groupement: updatedEquipe.groupement ? {
          id: updatedEquipe.groupement.code,
          name: updatedEquipe.groupement.libelle
        } : undefined,
        membres: updatedEquipe.membres?.map(membre => ({
          matricule: membre.identifiant,
          name: membre.nom,
          surname: membre.prenom
        })) || []
      };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'équipe ${code}:`, error);
      throw error;
    }
  },

  // Supprimer une équipe
  async deleteTeam(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/equipes/${code}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'équipe ${code}:`, error);
      throw error;
    }
  }
};

/**
 * Services pour les utilisateurs
 */
export const UserService = {
  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    try {
      // 1. Récupérer les utilisateurs
      const utilisateursResponse = await fetch(`${API_BASE_URL}/utilisateurs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!utilisateursResponse.ok) {
        throw new Error(`Erreur API utilisateurs: ${utilisateursResponse.status}`);
      }

      const utilisateurs: ApiUtilisateur[] = await utilisateursResponse.json();

      // 2. Récupérer les personnes pour compléter les données
      const personnesResponse = await fetch(`${API_BASE_URL}/personnes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!personnesResponse.ok) {
        throw new Error(`Erreur API personnes: ${personnesResponse.status}`);
      }

      const personnes: ApiPersonne[] = await personnesResponse.json();

      // Combiner les données des deux API
      return utilisateurs.map(utilisateur => {
        const personne = personnes.find(p => p.identifiant === utilisateur.matricule);

        return {
          matricule: utilisateur.matricule,
          name: personne ? personne.nom : 'Nom inconnu',
          surname: personne ? personne.prenom : 'Prénom inconnu',
          habilitations: utilisateur.habilitations?.map(hab => ({
            id: hab.code
          })) || []
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur par son matricule
  async getUserByMatricule(matricule: string): Promise<User> {
    try {
      // 1. Récupérer l'utilisateur
      const utilisateurResponse = await fetch(`${API_BASE_URL}/utilisateurs/${matricule}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!utilisateurResponse.ok) {
        throw new Error(`Erreur API utilisateur: ${utilisateurResponse.status}`);
      }

      const utilisateur: ApiUtilisateur = await utilisateurResponse.json();

      // 2. Récupérer les informations de la personne
      const personneResponse = await fetch(`${API_BASE_URL}/personnes/${matricule}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!personneResponse.ok) {
        throw new Error(`Erreur API personne: ${personneResponse.status}`);
      }

      const personne: ApiPersonne = await personneResponse.json();

      // Combiner les données des deux API
      return {
        matricule: utilisateur.matricule,
        name: personne.nom,
        surname: personne.prenom,
        habilitations: utilisateur.habilitations?.map(hab => ({
          id: hab.code
        })) || []
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${matricule}:`, error);
      throw error;
    }
  },

  // Créer ou mettre à jour un utilisateur
  async saveUser(user: User): Promise<User[]> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const checkResponse = await fetch(`${API_BASE_URL}/utilisateurs/${user.matricule}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let action;
      // Si l'utilisateur existe, mettre à jour ses habilitations
      if (checkResponse.ok) {
        action = fetch(`${API_BASE_URL}/utilisateurs/${user.matricule}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            habilitationsIds: user.habilitations.map(h => h.id)
          }),
        });
      } else if (checkResponse.status === 404) {
        // Si l'utilisateur n'existe pas, le créer
        action = fetch(`${API_BASE_URL}/utilisateurs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matricule: user.matricule,
            habilitationsIds: user.habilitations.map(h => h.id)
          }),
        });
      } else {
        throw new Error(`Erreur lors de la vérification de l'utilisateur: ${checkResponse.status}`);
      }

      // Exécuter l'action (création ou mise à jour)
      const actionResponse = await action;
      if (!actionResponse.ok) {
        throw new Error(`Erreur lors de la sauvegarde de l'utilisateur: ${actionResponse.status}`);
      }

      // Récupérer la liste mise à jour des utilisateurs
      return await this.getAllUsers();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  async deleteUser(matricule: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/utilisateurs/${matricule}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${matricule}:`, error);
      throw error;
    }
  }
};