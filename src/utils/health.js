export const auditSiteHealth = async () => {
  const audit = {
    seo: { score: 0, issues: [] },
    performance: { score: 0, issues: [] },
    accessibility: { score: 0, issues: [] }
  };

  // 1. SEO Audit
  const title = document.title;
  if (!title || title.length < 10) audit.seo.issues.push("Titre trop court ou manquant");
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) audit.seo.issues.push("Meta description manquante");
  
  const h1 = document.querySelectorAll('h1');
  if (h1.length === 0) audit.seo.issues.push("Aucun titre H1 trouvé");
  if (h1.length > 1) audit.seo.issues.push("Plusieurs H1 détectés (mauvais pour le SEO)");

  audit.seo.score = Math.max(0, 100 - (audit.seo.issues.length * 20));

  // 2. Accessibility Audit
  const images = document.querySelectorAll('img');
  let missingAlt = 0;
  images.forEach(img => {
    if (!img.alt) missingAlt++;
  });
  if (missingAlt > 0) audit.accessibility.issues.push(`${missingAlt} image(s) sans texte alternatif (alt)`);
  
  audit.accessibility.score = Math.max(0, 100 - (audit.accessibility.issues.length * 25));

  // 3. Performance Audit (Simulated check of images and response time)
  const navStart = performance.getEntriesByType("navigation")[0];
  const loadTime = navStart ? navStart.loadEventEnd - navStart.startTime : 0;
  if (loadTime > 2000) audit.performance.issues.push(`Temps de chargement lent: ${(loadTime/1000).toFixed(2)}s`);
  
  audit.performance.score = Math.max(0, 100 - (loadTime > 1500 ? 30 : 0));

  return audit;
};
