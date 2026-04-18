import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/logo.png', 
  url = window.location.href,
  type = 'website',
  noindex = false
}) => {
  const siteTitle = "Jonathan BATIONO | Développeur Web & Designer";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'website' ? "Person" : "CreativeWork",
          "name": "Jonathan BATIONO",
          "jobTitle": "Développeur Web & Designer",
          "url": "https://bationojonathan.me", // Replace with real URL if known
          "sameAs": [
            "https://www.linkedin.com/in/jonathan-bationo",
            "https://www.facebook.com/jonathanba.bationo",
            "https://github.com/Jojo-onedev"
          ],
          "description": description
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
