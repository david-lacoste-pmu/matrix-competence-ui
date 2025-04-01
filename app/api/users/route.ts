import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/types/user';

const dataFilePath = path.join(process.cwd(), 'data/users.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(fileData) as User[];
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read users data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    if (!user) {
      return NextResponse.json({ error: 'User data is required' }, { status: 400 });
    }

    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(fileData) as User[];
    
    // Check if user with this matricule already exists
    const existingUserIndex = users.findIndex(u => u.matricule === user.matricule);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update users' }, { status: 500 });
  }
}