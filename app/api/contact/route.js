import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, phone, message } = await request.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = await readData();
    const newSubmission = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      phone,
      message,
      createdAt: new Date().toISOString()
    };

    data.contact = data.contact || [];
    data.contact.unshift(newSubmission); // Add to the beginning

    await writeData(data);

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
