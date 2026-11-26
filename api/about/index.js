import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resSettings = await turso.execute('SELECT * FROM settings');
    const settingsMap = {};
    resSettings.rows.forEach(row => {
      settingsMap[row.key] = row.value;
    });
    res.status(200).json({ settings: settingsMap });
  } catch (error) {
    console.error('About fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch about data' });
  }
}