import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export default async function handler(req, res) {
  const { method, body } = req;

  try {
    switch (method) {
      case 'GET': {
        const resSettings = await turso.execute('SELECT * FROM settings');
        const settingsMap = {};
        resSettings.rows.forEach(row => {
          settingsMap[row.key] = row.value;
        });
        return res.status(200).json({ settings: settingsMap });
      }

      case 'POST': {
        const { settings } = body;
        if (!settings || typeof settings !== 'object') return res.status(400).json({ error: 'Invalid settings' });
        
        for (const [_key, value] of Object.entries(settings)) {
          await turso.execute({
            sql: 'INSERT INTO settings (key, value) ON CONFLICT(key) DO UPDATE SET value = ?',
            args: [value]
          });
        }
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}