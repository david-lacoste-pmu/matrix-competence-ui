import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Team } from '@/types/team';

const dataFilePath = path.join(process.cwd(), 'data/teams.json');

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const teams = JSON.parse(fileData) as Team[];
    
    const team = teams.find(t => t.code === params.code);
    
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    
    return NextResponse.json({ team });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read team data' }, { status: 500 });
  }
}