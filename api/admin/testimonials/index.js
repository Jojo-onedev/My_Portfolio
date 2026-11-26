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
          const resTestimonial = await turso.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
          if (resTestimonial.rows.length === 0) return res.status(404).json({ error: 'Testimonial not found' });
          return res.status(200).json({ testimonial: resTestimonial.rows[0] });
        } else {
          const resTestimonials = await turso.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
          return res.status(200).json({ testimonials: resTestimonials.rows });
        }
      }

      case 'POST': {
        const { name, role, quote, avatar } = body;
        if (!name || !role || !quote) return res.status(400).json({ error: 'Missing required fields' });
        const resInsert = await turso.execute({
          sql: 'INSERT INTO testimonials (name, role, quote, avatar) VALUES (?, ?, ?, ?)',
          args: [name, role, quote, avatar || '']
        });
        const newTestimonial = await turso.execute('SELECT * FROM testimonials WHERE id = ?', [resInsert.lastInsertRowid]);
        return res.status(201).json({ testimonial: newTestimonial.rows[0] });
      }

      case 'PUT': {
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        const { name: uName, role: uRole, quote: uQuote, avatar: uAvatar } = body;
        await turso.execute({
          sql: 'UPDATE testimonials SET name = ?, role = ?, quote = ?, avatar = ? WHERE id = ?',
          args: [uName, uRole, uQuote, uAvatar || '', id]
        });
        const updated = await turso.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
        return res.status(200).json({ testimonial: updated.rows[0] });
      }

      case 'DELETE': {
        if (!id) return res.status(400).json({ error: 'Missing ID' });
        await turso.execute({ sql: 'DELETE FROM testimonials WHERE id = ?', args: [id] });
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}