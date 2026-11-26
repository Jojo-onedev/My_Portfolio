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
    // 1. Total Visits & Unique Visitors
    const resTotal = await turso.execute('SELECT COUNT(*) as total, COUNT(DISTINCT visitor_id) as unique_v FROM analytics');
    const totalVisits = resTotal.rows[0]?.total || 0;
    const uniqueVisitors = resTotal.rows[0]?.unique_v || 0;

    // 2. Weekly Visits Chart
    const resWeekly = await turso.execute(`
      SELECT 
        strftime('%w', timestamp) as day_index,
        COUNT(*) as visits
      FROM analytics 
      WHERE timestamp >= date('now', '-7 days')
      GROUP BY day_index
      ORDER BY timestamp ASC
    `);
    
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const chartData = resWeekly.rows.map(row => ({
      name: dayNames[parseInt(row.day_index)],
      visits: row.visits
    }));

    // 3. Top Pages
    const resPages = await turso.execute(`
      SELECT page_path as name, COUNT(*) as value 
      FROM analytics 
      GROUP BY page_path 
      ORDER BY value DESC 
      LIMIT 4
    `);

    // 4. Top Countries
    const resGeo = await turso.execute(`
      SELECT country as name, COUNT(*) as value
      FROM analytics
      WHERE country IS NOT NULL AND country != 'Local'
      GROUP BY country
      ORDER BY value DESC
      LIMIT 5
    `);

    // 5. Top Referrers
    const resReferrers = await turso.execute(`
      SELECT referrer as name, COUNT(*) as value
      FROM analytics
      WHERE referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer
      ORDER BY value DESC
      LIMIT 5
    `);

    // 6. Projects count
    const resProjects = await turso.execute('SELECT COUNT(*) as total FROM projects');

    const stats = [
      { label: 'Visites Totales', value: totalVisits.toLocaleString(), change: '+100%', color: 'text-blue-500' },
      { label: 'Visiteurs Uniques', value: uniqueVisitors.toLocaleString(), change: '+100%', color: 'text-green-500' },
      { label: 'Projets Actifs', value: resProjects.rows[0].total.toString(), change: 'Live', color: 'text-primary' },
      { label: 'Uptime', value: '99.9%', change: 'Stable', color: 'text-purple-500' },
    ];

    const pageViews = resPages.rows.map(row => ({
      name: row.name === '/' ? 'Accueil' : row.name.replace('/', ''),
      value: row.value
    }));

    const topCountries = resGeo.rows;

    const referrers = resReferrers.rows.map(r => {
      let domain = r.name;
      try {
        domain = new URL(r.name).hostname.replace('www.', '');
      } catch { /* ignore */ }
      return { name: domain, value: r.value };
    });

    res.status(200).json({
      stats,
      visitData: chartData.length > 0 ? chartData : [
        { name: 'Lun', visits: 0 }, { name: 'Mar', visits: 0 }, { name: 'Mer', visits: 0 }, 
        { name: 'Jeu', visits: 0 }, { name: 'Ven', visits: 0 }, { name: 'Sam', visits: 0 }, { name: 'Dim', visits: 0 }
      ],
      pageViews,
      topCountries,
      referrers
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}