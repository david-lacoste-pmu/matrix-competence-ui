import { NextResponse } from 'next/server';
import { User, Habilitation } from '@/types/user';

// URL de base de l'API
const API_BASE_URL = 'http://localhost:8080';

export async function GET() {
  try {
    // Récupérer la liste des utilisateurs
    const usersResponse = await fetch(`${API_BASE_URL}/utilisateurs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!usersResponse.ok) {
      throw new Error(`Erreur API utilisateurs: ${usersResponse.status}`);
    }

    const utilisateurs = await usersResponse.json();

    // Récupérer la liste des personnes pour avoir les noms et prénoms
    const personnesResponse = await fetch(`${API_BASE_URL}/personnes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!personnesResponse.ok) {
      throw new Error(`Erreur API personnes: ${personnesResponse.status}`);
    }

    const personnes = await personnesResponse.json();

    // Transformation des données des deux API au format attendu
    const users: User[] = utilisateurs.map((utilisateur: any) => {
      // Trouver la personne correspondante en utilisant le matricule comme identifiant
      const personne = personnes.find((p: any) => p.identifiant === utilisateur.matricule);

      return {
        matricule: utilisateur.matricule,
        name: personne ? personne.nom : 'Nom inconnu',
        surname: personne ? personne.prenom : 'Prénom inconnu',
        habilitations: utilisateur.habilitations?.map((hab: any) => ({
          id: hab.code
        })) || []
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Failed to fetch users data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    if (!user) {
      return NextResponse.json({ error: 'User data is required' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const checkResponse = await fetch(`${API_BASE_URL}/utilisateurs/${user.matricule}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Si l'utilisateur existe, mettre à jour ses habilitations
    if (checkResponse.ok) {
      const updateResponse = await fetch(`${API_BASE_URL}/utilisateurs/${user.matricule}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habilitationsIds: user.habilitations.map((h: Habilitation) => h.id)
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${updateResponse.status}`);
      }
    } else if (checkResponse.status === 404) {
      // Si l'utilisateur n'existe pas, le créer
      const createResponse = await fetch(`${API_BASE_URL}/utilisateurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricule: user.matricule,
          habilitationsIds: user.habilitations.map((h: Habilitation) => h.id)
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${createResponse.status}`);
      }
    } else {
      throw new Error(`Erreur lors de la vérification de l'utilisateur: ${checkResponse.status}`);
    }

    // Récupérer la liste mise à jour des utilisateurs
    const updatedResponse = await fetch(`${API_BASE_URL}/utilisateurs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!updatedResponse.ok) {
      throw new Error(`Erreur lors de la récupération des utilisateurs mis à jour: ${updatedResponse.status}`);
    }

    const utilisateurs = await updatedResponse.json();
    
    // Récupérer la liste des personnes pour avoir les noms et prénoms
    const personnesResponse = await fetch(`${API_BASE_URL}/personnes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!personnesResponse.ok) {
      throw new Error(`Erreur API personnes: ${personnesResponse.status}`);
    }

    const personnes = await personnesResponse.json();

    // Transformation des données
    const users: User[] = utilisateurs.map((utilisateur: any) => {
      const personne = personnes.find((p: any) => p.identifiant === utilisateur.matricule);
      return {
        matricule: utilisateur.matricule,
        name: personne ? personne.nom : 'Nom inconnu',
        surname: personne ? personne.prenom : 'Prénom inconnu',
        habilitations: utilisateur.habilitations?.map((hab: any) => ({
          id: hab.code
        })) || []
      };
    });
    
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message || 'Failed to update users' }, { status: 500 });
  }
}