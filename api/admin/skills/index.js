import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export default async function handler(req, res) {
  const { method, query, body } = req;
  const id = query.id;

  try {
    switch (method) {
      case 'GET': {
        if (id) {
          const resSkill = await turso.execute('SELECT * FROM skills WHERE id = ?', [id]);
          if (resSkill.rows.length === 0) return res.status(404).json({ error: 'Skill not found' });
          return res.status(200).json({ skill: resSkill.rows[0] });
        } else {
          const resSkills = await turso.execute('SELECT * FROM skills ORDER BY created_at DESC');
          return res.status(200).json({ skills: resSkills.rows });
        }
      }

      case 'POST': {
        const { name, level, category, color, bg, border } = body;
        if (!name || !level || !category) return res.status(400).json({ error: 'Missing required fields' });
        const resInsert = await turso.execute({
          sql: 'INSERT INTO skills (name, level, category, color, bg, border) VALUES (?, ?, ?, ?, ?, ?)',
          args: [name, level, category, color || 'text-primary', bg || 'bg-primary/5', border || 'hover:border-primary/40']
        });
        const newSkill = await turso.execute('SELECT * FROM skills WHERE id = ?', [resInsert.lastInsertRowid]);
        return res.status(201).json({ skill: newSkill.rows[0] });
      }

      case 'PUT': {
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const { name: uName, level: uLevel, category: uCat, color: uColor, bg: uBg, border: uBorder } = body;
        await turso.execute({
          sql: 'UPDATE skills SET name = ?, level = ?, category = ?, color = ?, bg = ?, border = ? WHERE id = ?',
          args: [uName, uLevel, uCat, uColor, uBg, uBorder, id]
        });
        const updated = await turso.execute('SELECT * FROM skills WHERE id = ?', [id]);
        return res.status(200).json({ skill: updated.rows[0] });
      }

      case 'DELETE': {
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        await turso.execute({ sql: 'DELETE FROM skills WHERE id = ?', args: [id] });
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin skills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}