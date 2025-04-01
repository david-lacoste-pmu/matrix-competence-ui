import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Team } from '@/types/team';

const dataFilePath = path.join(process.cwd(), 'data/teams.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const teams = JSON.parse(fileData) as Team[];
    return NextResponse.json({ teams });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read teams data' }, { status: 500 });
  }
}