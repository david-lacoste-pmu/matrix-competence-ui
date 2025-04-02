// Authentication service for interacting with backend API
import { Habilitation } from "@/types/user";

// URL de base de l'API backend
const API_BASE_URL = 'http://localhost:8080';

// Types from Swagger spec
export interface ApiUtilisateur {
    matricule: string;
    habilitations?: ApiHabilitation[];
}

export interface ApiHabilitation {
    code: string;
    description?: string;
}

export interface AuthResult {
    success: boolean;
    user?: ApiUtilisateur;
    error?: string;
}

/**
 * Authentication Service
 */
export const AuthService = {
    /**
     * Authenticate a user by matricule
     * @param matricule The user's matricule
     * @returns Result of authentication attempt
     */
    async authenticate(matricule: string): Promise<AuthResult> {
        try {
            if (!matricule) {
                return {
                    success: false,
                    error: "Le matricule est requis"
                };
            }

            const response = await fetch(`${API_BASE_URL}/utilisateurs/${matricule}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return {
                        success: false,
                        error: "Utilisateur non trouvé"
                    };
                }
                throw new Error(`Erreur API: ${response.status}`);
            }

            const user: ApiUtilisateur = await response.json();
            
            // Store user in session/localStorage for future use
            if (typeof window !== 'undefined') {
                localStorage.setItem('currentUser', JSON.stringify(user));
            }

            return {
                success: true,
                user
            };
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error);
            return {
                success: false,
                error: "Une erreur est survenue lors de la connexion"
            };
        }
    },

    /**
     * Check if user is currently authenticated
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        
        const storedUser = localStorage.getItem('currentUser');
        return !!storedUser;
    },

    /**
     * Get the current authenticated user
     */
    getCurrentUser(): ApiUtilisateur | null {
        if (typeof window === 'undefined') return null;
        
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    },

    /**
     * Log out the current user
     */
    logout(): void {
        if (typeof window === 'undefined') return;
        
        localStorage.removeItem('currentUser');
    }
};