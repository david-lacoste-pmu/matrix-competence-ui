import { NextResponse } from 'next/server';

// URL de base de l'API
const API_BASE_URL = 'http://localhost:8080';

export async function DELETE(request: Request) {
  try {
    const { matricule } = await request.json();
    
    if (!matricule) {
      return NextResponse.json({ error: 'User matricule is required' }, { status: 400 });
    }

    // Appel à l'API pour supprimer l'utilisateur
    const response = await fetch(`${API_BASE_URL}/utilisateurs/${matricule}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Si l'utilisateur n'existe pas
    if (response.status === 404) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Si la suppression a échoué
    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}