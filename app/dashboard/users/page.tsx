"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types/user"
import { EditUserDialog } from "@/components/edit-user-dialog"

// Sample data - in a real app this would come from an API or database
const initialUsers: User[] = [
  {
    matricule: "EMP12345",
    name: "John",
    surname: "Doe",
    habilitations: [
      { id: "HAB1" },
      { id: "HAB2" },
    ],
  },
  {
    matricule: "EMP67890",
    name: "Jane",
    surname: "Smith",
    habilitations: [
      { id: "HAB1" },
      { id: "HAB3" },
      { id: "HAB4" },
    ],
  },
  {
    matricule: "EMP54321",
    name: "Michael",
    surname: "Johnson",
    habilitations: [
      { id: "HAB2" },
    ],
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  const handleEditClick = (user: User) => {
    setCurrentUser({...user, habilitations: [...user.habilitations]})
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.matricule === updatedUser.matricule ? updatedUser : user
    ))
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions in the system.
          </p>
        </div>
        <div className="rounded-lg border">
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
                      {user.habilitations.map((habilitation) => (
                        <span
                          key={habilitation.id}
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
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <EditUserDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
      />
    </DashboardShell>
  )
}