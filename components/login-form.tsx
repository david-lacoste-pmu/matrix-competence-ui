"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthService } from "@/lib/auth-service"
import { AlertCircle, Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [matricule, setMatricule] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!matricule.trim()) {
      setError("Le matricule est requis")
      return
    }

    try {
      setError(null)
      setIsLoading(true)
      
      const result = await AuthService.authenticate(matricule)
      
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push("/dashboard")
      } else {
        setError(result.error || "Échec de l'authentification")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Connexion</CardTitle>
          <CardDescription>
            Entrez votre matricule pour accéder à Matrix de Compétences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="grid gap-3">
                <Label htmlFor="matricule">Matricule</Label>
                <Input
                  id="matricule"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="Ex: EMP12345"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Votre matricule est votre identifiant unique dans le système.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : "Se connecter"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Button variant="outline" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23" className="mr-2">
                <path fill="#f25022" d="M0 0h10.5v10.5h-10.5z"></path>
                <path fill="#7fba00" d="M12.5 0h10.5v10.5h-10.5z"></path>
                <path fill="#00a4ef" d="M0 12.5h10.5v10.5h-10.5z"></path>
                <path fill="#ffb900" d="M12.5 12.5h10.5v10.5h-10.5z"></path>
              </svg>
              Connexion avec Microsoft
            </Button>
          </div>
        </CardFooter>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        En vous connectant, vous acceptez nos <a href="#" className="underline underline-offset-4 hover:text-primary">Conditions d'utilisation</a>{" "}
        et <a href="#" className="underline underline-offset-4 hover:text-primary">Politique de confidentialité</a>.
      </div>
    </div>
  )
}