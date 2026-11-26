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
          const resProject = await turso.execute('SELECT * FROM projects WHERE id = ?', [id]);
          if (resProject.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
          }
          return res.status(200).json({ project: resProject.rows[0] });
        } else {
          const resProjects = await turso.execute('SELECT * FROM projects ORDER BY created_at DESC');
          return res.status(200).json({ projects: resProjects.rows });
        }
      }

      case 'POST': {
        const { title, description, image, link, category } = body;
        if (!title || !description || !image || !category) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const resInsert = await turso.execute({
          sql: 'INSERT INTO projects (title, description, image, link, category) VALUES (?, ?, ?, ?, ?)',
          args: [title, description, image, link || '', category]
        });
        const newProject = await turso.execute('SELECT * FROM projects WHERE id = ?', [resInsert.lastInsertRowid]);
        return res.status(201).json({ project: newProject.rows[0] });
      }

      case 'PUT': {
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const { title: uTitle, description: uDesc, image: uImage, link: uLink, category: uCat } = body;
        await turso.execute({
          sql: 'UPDATE projects SET title = ?, description = ?, image = ?, link = ?, category = ? WHERE id = ?',
          args: [uTitle, uDesc, uImage, uLink || '', uCat, id]
        });
        const updated = await turso.execute('SELECT * FROM projects WHERE id = ?', [id]);
        return res.status(200).json({ project: updated.rows[0] });
      }

      case 'DELETE': {
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        await turso.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}