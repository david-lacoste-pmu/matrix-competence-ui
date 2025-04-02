import { NextResponse } from 'next/server';
import { Team } from '@/types/team';

// URL de base de l'API
const API_BASE_URL = 'http://localhost:8080';

export async function GET() {
  try {
    // Appel à l'API externe pour récupérer les équipes
    const response = await fetch(`${API_BASE_URL}/equipes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const equipes = await response.json();

    // Transformation des données de l'API au format attendu par l'application
    const teams: Team[] = equipes.map((equipe: any) => ({
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
    }));

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    return NextResponse.json({ error: 'Failed to fetch teams data' }, { status: 500 });
  }
}