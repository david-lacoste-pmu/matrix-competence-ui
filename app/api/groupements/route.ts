import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Groupement } from '@/types/groupement';

const dataFilePath = path.join(process.cwd(), 'data/groupements.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const groupements = JSON.parse(fileData) as Groupement[];
    return NextResponse.json({ groupements });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read groupements data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { groupement } = await request.json();
    if (!groupement) {
      return NextResponse.json({ error: 'Groupement data is required' }, { status: 400 });
    }

    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const groupements = JSON.parse(fileData) as Groupement[];
    
    // Check if groupement with this code already exists
    const existingGroupementIndex = groupements.findIndex(g => g.code === groupement.code);
    
    if (existingGroupementIndex >= 0) {
      // Update existing groupement
      groupements[existingGroupementIndex] = groupement;
    } else {
      // Add new groupement
      groupements.push(groupement);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(groupements, null, 2));
    
    return NextResponse.json({ success: true, groupements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update groupements' }, { status: 500 });
  }
}