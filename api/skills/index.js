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
    const resSkills = await turso.execute('SELECT * FROM skills ORDER BY id ASC');
    res.status(200).json({ skills: resSkills.rows });
  } catch (error) {
    console.error('Skills fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
}