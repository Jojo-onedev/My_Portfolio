import turso from '../lib/turso';

export const logVisit = async (path) => {
  try {
    const visitorId = localStorage.getItem('visitor_id') || Math.random().toString(36).substring(2, 15);
    localStorage.setItem('visitor_id', visitorId);

    // Geolocation - Non-blocking fetch
    let geo = { country: 'Local', city: 'Local' };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const geoRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (geoRes.ok) {
        const data = await geoRes.json();
        geo = { country: data.country_name || 'Inconnu', city: data.city || 'Inconnu' };
      }
    } catch (e) { console.warn('Geo fetch failed'); }

    await turso.execute({
      sql: 'INSERT INTO analytics (page_path, visitor_id, user_agent, referrer, country, city) VALUES (?, ?, ?, ?, ?, ?)',
      args: [path, visitorId, navigator.userAgent, document.referrer, geo.country, geo.city]
    });
  } catch (err) {
    console.error('Analytics log failed:', err);
  }
};
