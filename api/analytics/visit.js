import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path, visitorId, userAgent, referrer, country, city } = req.body;

    if (!path) {
      return res.status(400).json({ error: 'Missing path' });
    }

    await turso.execute({
      sql: 'INSERT INTO analytics (page_path, visitor_id, user_agent, referrer, country, city) VALUES (?, ?, ?, ?, ?, ?)',
      args: [path, visitorId, userAgent, referrer, country, city]
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to log visit' });
  }
}