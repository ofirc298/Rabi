import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function POST(request) {
  try {
    const { firstName, lastName, phone, source } = await request.json();

    if (!firstName || !lastName || !phone || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Read current data
    let fileContent;
    try {
      fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    } catch (err) {
      fileContent = JSON.stringify({ contact: [], volunteer: [] });
    }

    const data = JSON.parse(fileContent);
    const newSubmission = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      firstName,
      lastName,
      phone,
      source,
      createdAt: new Date().toISOString()
    };

    data.volunteer = data.volunteer || [];
    data.volunteer.unshift(newSubmission); // Add to the beginning

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error('Volunteer submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
