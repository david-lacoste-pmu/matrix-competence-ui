import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/types/user';

const dataFilePath = path.join(process.cwd(), 'data/users.json');

export async function DELETE(request: Request) {
  try {
    const { matricule } = await request.json();
    
    if (!matricule) {
      return NextResponse.json({ error: 'User matricule is required' }, { status: 400 });
    }

    // Read the current users
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(fileData) as User[];
    
    // Find user index
    const userIndex = users.findIndex(user => user.matricule === matricule);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Remove the user
    users.splice(userIndex, 1);
    
    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}