import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Groupement } from '@/types/groupement';

const dataFilePath = path.join(process.cwd(), 'data/groupements.json');

export async function DELETE(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Groupement code is required' }, { status: 400 });
    }

    // Read the current groupements
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const groupements = JSON.parse(fileData) as Groupement[];
    
    // Find groupement index
    const groupementIndex = groupements.findIndex(g => g.code === code);
    
    if (groupementIndex === -1) {
      return NextResponse.json({ error: 'Groupement not found' }, { status: 404 });
    }
    
    // Remove the groupement
    groupements.splice(groupementIndex, 1);
    
    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(groupements, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete groupement' },
      { status: 500 }
    );
  }
}