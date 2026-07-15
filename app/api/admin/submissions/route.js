import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

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
    const data = await readData();
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

    const data = await readData();

    if (type === 'contact') {
      data.contact = (data.contact || []).filter((item) => item.id !== id);
    } else if (type === 'volunteer') {
      data.volunteer = (data.volunteer || []).filter((item) => item.id !== id);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
