import { NextResponse } from 'next/server';
import { Team } from '@/types/team';

// URL de base de l'API
const API_BASE_URL = 'http://localhost:8080';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    // Appel à l'API externe pour récupérer une équipe spécifique
    const response = await fetch(`${API_BASE_URL}/equipes/${params.code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const equipe = await response.json();

    // Transformation des données de l'API au format attendu par l'application
    const team: Team = {
      code: equipe.code,
      nom: equipe.nom,
      description: equipe.description || '',
      groupement: equipe.groupement ? {
        id: equipe.groupement.code,
        name: equipe.groupement.libelle
      } : undefined,
      membres: equipe.membres?.map((membre: any) => ({
        matricule: membre.identifiant,
        name: membre.nom,
        surname: membre.prenom
      })) || []
    };

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'équipe:', error);
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
  }
}