export const logVisit = async (path) => {
  try {
    const visitorId = localStorage.getItem('visitor_id') || Math.random().toString(36).substring(2, 15);
    localStorage.setItem('visitor_id', visitorId);

    let geo = { country: 'Local', city: 'Local' };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    try {
      const geoRes = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (geoRes.ok) {
        const data = await geoRes.json();
        geo = { country: data.country_name || 'Inconnu', city: data.city || 'Inconnu' };
      }
    } catch { /* geolocation silencieuse */ }

    try {
      await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          visitorId,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          country: geo.country,
          city: geo.city
        })
      });
    } catch { /* analytics silencieuse */ }
  } catch { /* noop */ }
};
