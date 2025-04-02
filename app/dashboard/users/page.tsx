"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types/user"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { AddUserDialog } from "@/components/add-user-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserService } from "@/lib/api-service"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  // Fetch users data directly from the backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserService.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleEditClick = (user: User) => {
    setCurrentUser({...user, habilitations: [...user.habilitations]})
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteAlertOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await UserService.deleteUser(userToDelete.matricule);
      // Update the local state by removing the deleted user
      setUsers(users.filter(user => user.matricule !== userToDelete.matricule));
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setUserToDelete(null);
      setDeleteAlertOpen(false);
    }
  }

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const updatedUsers = await UserService.saveUser(updatedUser);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  const handleAddUser = async (newUser: User) => {
    try {
      const updatedUsers = await UserService.saveUser(newUser);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions in the system.
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <div className="rounded-lg border">
          {isLoading ? (
            <div className="p-4 text-center">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Surname</TableHead>
                  <TableHead>Habilitations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.matricule}>
                    <TableCell className="font-medium">{user.matricule}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.habilitations.map((habilitation, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {habilitation.id}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-sm text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      <EditUserDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
      />
      
      <AddUserDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddUser}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {userToDelete && (
                <span className="font-medium"> {userToDelete.name} {userToDelete.surname} ({userToDelete.matricule})</span>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}