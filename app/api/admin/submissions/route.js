import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yeshaya123';

function checkAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  return token === ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let fileContent;
    try {
      fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    } catch (err) {
      fileContent = JSON.stringify({ contact: [], volunteer: [] });
    }
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'contact' or 'volunteer'
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    let fileContent;
    try {
      fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    } catch (err) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }

    const data = JSON.parse(fileContent);

    if (type === 'contact') {
      data.contact = (data.contact || []).filter((item) => item.id !== id);
    } else if (type === 'volunteer') {
      data.volunteer = (data.volunteer || []).filter((item) => item.id !== id);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
