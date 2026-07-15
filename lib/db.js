import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export async function readData() {
  // Check if Vercel KV is configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(process.env.KV_REST_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['GET', 'submissions']),
        cache: 'no-store'
      });
      if (res.ok) {
        const { result } = await res.json();
        if (result) {
          return JSON.parse(result);
        }
      }
    } catch (err) {
      console.error('Vercel KV read error:', err);
    }
  }

  // Fallback to local file storage
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    return { contact: [], volunteer: [] };
  }
}

export async function writeData(data) {
  // Check if Vercel KV is configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(process.env.KV_REST_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', 'submissions', JSON.stringify(data)])
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Vercel KV write error:', err);
    }
  }

  // Fallback to local file storage
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Local file write error:', err);
    return false;
  }
}
