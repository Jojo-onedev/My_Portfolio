# Suivi de l'audit du portfolio

Ce document sert de backlog de correction. Cocher les éléments uniquement après correction et vérification.

- `[ ]` À faire
- `[x]` Corrigé et vérifié

## Périmètre et état initial

- Audit du code du dépôt et observation du site public [bationojonathan.me](https://www.bationojonathan.me/) le 24 novembre 2026.
- Le fichier `.env` n'a pas été consulté.
- Le build de production réussit, mais signale des chunks volumineux et des données Browserslist obsolètes.
- Le lint ne démarre pas : la commande `eslint` est absente.
- Aucune mesure Lighthouse ni aucun test automatisé n'a été exécuté.
- Les observations sur le site en production sont celles du rendu et des erreurs navigateur observés pendant cette session ; elles doivent être revalidées après chaque déploiement.

## Synthèse

Le portfolio a une identité visuelle cohérente, une navigation claire, un affichage responsive, un mode sombre, deux langues, des sections bien structurées et des appels à l'action visibles. Les priorités sont de sécuriser l'administration et l'accès à la base, rétablir les fonctions bloquées par les erreurs SQL et les en-têtes HTTP, fiabiliser le contenu affiché, puis améliorer le SEO, l'accessibilité et le poids JavaScript.

## Direction de refonte retenue

- Référence immersive : [pivenilya.com](https://pivenilya.com/) — hero sombre, texture légère, typographie expressive et mise en scène des projets.
- Captures partagées : cadres arrondis et visuels forts, à adapter à un portfolio plutôt qu'à une boutique ou un studio de mobilier.
- Palette conservée : rouge profond, noir et blanc ; utiliser le rouge comme accent plutôt que comme fond dominant.
- Approche hybride choisie : hero immersif, portfolio éditorial avec un projet mis en avant, cartes de projets plus lisibles, alternance de sections claires et sombres.
- Contraintes : préserver les contenus, langues, routes, navigation mobile et mode sombre ; garder les effets légers et respecter la réduction des animations.
- [x] Première passe réalisée : hero sombre à grande typographie, galerie de projets avec réalisation principale mise en avant, cartes simplifiées, états de chargement/vide traduits et prise en charge du mode réduit pour le défilement et l'image des projets.
- [x] Vérification visuelle de la première passe sur aperçu local desktop, mobile et mode sombre ; navigation mobile ouverte et absence de débordement horizontal du document constatées.
- [x] Contrastes renforcés sur les fonds sombres (témoignages, pied de page, navigation et mode sombre) ; icônes sociales GitHub, LinkedIn et Facebook rendues blanches avec fond contrasté et accent rouge au survol.
- [x] Pied de page : nom forcé en clair sur fond sombre et adresse e-mail complète rendue visible et cliquable.
- [x] Galerie complète ajoutée sur `/projects`, avec filtres, fiches modales, lien externe uniquement lorsqu’il existe et bouton « Voir tout » depuis la page d’accueil.
- [x] Contenus administrables basculés vers Supabase : authentification et politiques RLS, stockage d’images et CRUD. L'utilisateur repart avec des tables vides et recréera les contenus via l’admin ; aucun import Turso n’est prévu.
- [ ] Vérifier l’ajout réel des contenus par l’admin après configuration des variables Supabase ; les statistiques de visite restent sur Turso.

## P0 — Sécurité et accès aux données

- [x] **Remplacer l'authentification locale de l'admin.** Le formulaire utilise désormais Supabase Auth et l'accès admin est vérifié par la table `admin_users` ainsi que par les politiques RLS. L'activation réelle reste conditionnée à l'exécution de [schema.sql](./supabase/schema.sql) et à l'ajout du compte admin.
  Références : [AdminAuthContext.jsx](./src/context/AdminAuthContext.jsx), [AdminLogin.jsx](./src/components/Admin/Login/AdminLogin.jsx), [schema.sql](./supabase/schema.sql).

- [x] **Retirer le jeton Turso du bundle client.** Les contenus administrables passent désormais par Supabase et RLS, mais Turso reste utilisé par les écritures d'analytics depuis le navigateur et par le tableau de bord. Vérifier et renouveler le jeton Turso si nécessaire, puis déplacer ou remplacer l'analytics avant de supprimer la configuration Turso du frontend.  
  Références : [turso.js](./src/lib/turso.js), [analytics.js](./src/utils/analytics.js), [Dashboard.jsx](./src/components/Admin/Dashboard/Dashboard.jsx).

## P1 — Bugs fonctionnels et fiabilité

- [x] **Corriger la sauvegarde des paramètres.** L'admin utilise maintenant l'upsert Supabase sur la clé des paramètres. Vérification réelle à refaire après la configuration du projet et l'exécution de la migration.
  Références : [SettingsManager.jsx](./src/components/Admin/CRUD/SettingsManager.jsx), [schema.sql](./supabase/schema.sql).

- [x] **Aligner le champ image des témoignages.** Le contenu public et l'admin utilisent maintenant `avatar_url`; les avatars sont téléversés dans Supabase Storage et un affichage de remplacement existe sans avatar. Vérifier avec les données après migration.
  Références : [schema.sql](./supabase/schema.sql), [TestimonialManager.jsx](./src/components/Admin/CRUD/TestimonialManager.jsx), [Testimonials.jsx](./src/components/Testimonials/Testimonials.jsx).

- [x] **Configurer et valider les contenus Supabase en production.** Projets, compétences, témoignages et réglages lisent désormais Supabase. La page projets affiche une erreur de chargement explicite ; après configuration, vérifier les identifiants de déploiement, recréer les contenus dans l’admin et tester les états vide/erreur des autres sections.  
  Références : [Projects.jsx](./src/components/Projects/Projects.jsx), [ProjectsPage.jsx](./src/components/Projects/ProjectsPage.jsx), [Skills.jsx](./src/components/Skills/Skills.jsx), [Testimonials.jsx](./src/components/Testimonials/Testimonials.jsx), [SETUP.md](./supabase/SETUP.md).

- [x] **Corriger les blocages CSP et COEP observés en production.** Le code appelle `https://ipapi.co/json/`, mais la CSP autorise `https://api.ipapi.co`. Des requêtes Google Analytics vers `analytics.google.com` et `www.google.com` sont aussi bloquées. Par ailleurs, `Cross-Origin-Embedder-Policy: require-corp` bloque des images externes observées sur le site. Adapter les en-têtes aux dépendances réellement nécessaires, ou héberger les ressources concernées localement ; ne pas élargir les autorisations sans vérifier chaque origine.  
  Références : [analytics.js](./src/utils/analytics.js), [vercel.json](./vercel.json), [netlify.toml](./netlify.toml).

- [x] **Unifier la configuration Google Analytics.** Le HTML source contient l'identifiant `G-EWPKTEHNW8`, tandis que les requêtes observées en production utilisent `G-MDZYNBJ0B7`. L'application peut aussi charger Analytics depuis une variable d'environnement en plus du script HTML. Choisir une seule source de configuration et confirmer que les événements arrivent dans la propriété voulue.  
  Références : [index.html](./index.html), [App.jsx](./src/App.jsx).

- [x] **Supprimer ou justifier les métriques fictives des cartes projets.** Les taux de conversion aléatoires et les indicateurs fixes ont été retirés des cartes projets lors de la refonte.  
  Référence : [Projects.jsx](./src/components/Projects/Projects.jsx).

- [x] **Fiabiliser la page Actualités.** Les échecs de requêtes par tag sont consignés en console puis ignorés, ce qui peut afficher une page vide sans explication. Afficher un état d'erreur/retry clair, éviter les chargements inutiles et vérifier le comportement de pagination et de changement de catégorie.  
  Référence : [News.jsx](./src/components/News/News.jsx).

- [x] **Rendre l'échec EmailJS explicite si la configuration manque.** Vérifier les variables nécessaires au démarrage et présenter une solution de contact alternative si elles sont absentes ou si le service échoue.  
  Référence : [Contact.jsx](./src/components/Contact/Contact.jsx).

## P2 — Vie privée, SEO, accessibilité et contenu

- [ ] **Documenter et encadrer la collecte analytique.** Le suivi utilise un identifiant persistant dans `localStorage`, l'agent utilisateur, le référent et une géolocalisation approximative obtenue auprès d'un service tiers. Définir les données réellement nécessaires, leur durée de conservation et les règles de consentement applicables. Les erreurs d'enregistrement sont actuellement silencieuses.  
  Référence : [analytics.js](./src/utils/analytics.js).

- [ ] **Remplacer les liens légaux factices.** Les liens « Privacy Policy » et « Terms of Service » pointent actuellement vers `#`. Créer les pages correspondantes si elles sont nécessaires, ou retirer ces liens tant qu'elles n'existent pas.  
  Référence : [Footer.jsx](./src/components/Footer/Footer.jsx).

- [ ] **Harmoniser les métadonnées et domaines.** Le titre public observé est en français alors que le contenu visible est en anglais ; `lang` est fixé à `en`, tandis que le balisage structuré, le sitemap et le site public utilisent des variantes différentes du domaine. Unifier langue, titres, URL canonique, Open Graph et URL JSON-LD pour les pages concernées.  
  Références : [index.html](./index.html), [SEO.jsx](./src/components/SEO/SEO.jsx), [sitemap.xml](./public/sitemap.xml), [robots.txt](./public/robots.txt).

- [ ] **Nettoyer le sitemap.** Les fragments `#hero`, `#about`, `#projects`, etc. ne sont pas des pages distinctes à indexer. Conserver les vraies routes publiques et utiliser partout le même domaine canonique.  
  Référence : [sitemap.xml](./public/sitemap.xml).

- [ ] **Améliorer l'accessibilité des formulaires et commandes.** Ajouter des labels explicites aux champs de contact, des états de succès/erreur annoncés aux technologies d'assistance et vérifier les noms accessibles des boutons icon-only dans l'interface publique et admin.  
  Références : [Contact.jsx](./src/components/Contact/Contact.jsx), [Projects.jsx](./src/components/Projects/Projects.jsx), [ProjectManager.jsx](./src/components/Admin/CRUD/ProjectManager.jsx).

- [ ] **Respecter les préférences de mouvement et le curseur natif.** Les animations n'ont pas de traitement évident de `prefers-reduced-motion`, et le curseur natif est masqué sur ordinateur. Ajouter une version sans animation et ne masquer le curseur que si le curseur personnalisé est réellement utilisable.  
  Référence : [CustomCursor.jsx](./src/components/Cursor/CustomCursor.jsx).

- [ ] **Vérifier les affirmations marketing.** Les statistiques du hero (`5+`, `3+`), les affirmations de performance et les promesses de service doivent être confirmées et mises à jour lorsqu'elles ne sont pas maintenues automatiquement.  
  Références : [Hero.jsx](./src/components/Hero/Hero.jsx), [translation.json FR](./src/locales/fr/translation.json), [translation.json EN](./src/locales/en/translation.json).

## P2 — Qualité technique et performance

- [ ] **Réduire le JavaScript initial et les gros chunks.** Le dernier build observé produit un bundle initial d'environ 730 kB (240 kB gzip), un chunk Dashboard d'environ 386 kB et un chunk 404 d'environ 335 kB. Examiner le découpage des dépendances et la taille de Lottie ; revalider avec le rapport de build après optimisation.  
  Références : [App.jsx](./src/App.jsx), [Dashboard.jsx](./src/components/Admin/Dashboard/Dashboard.jsx), [NotFound.jsx](./src/components/NotFound/NotFound.jsx), [package.json](./package.json).

- [x] **Rendre le lint exécutable.** `npm run lint` échoue car `eslint` n'est pas installé/déclaré. Ajouter et configurer la dépendance adaptée, ou corriger le script si la configuration prévue a changé. Puis lancer le lint et traiter les résultats.  
  Références : [package.json](./package.json), [eslint.config.js](./eslint.config.js).

- [ ] **Mettre à jour la base Browserslist.** Le build signale des données `caniuse-lite` obsolètes. Les mettre à jour via l'outil prévu par le dépôt puis vérifier le diff du lockfile.  
  Référence : [package-lock.json](./package-lock.json).

- [ ] **Remplacer l'audit de santé simulé par des mesures explicites.** `auditSiteHealth` vérifie un petit nombre de métadonnées et d'images, puis calcule des scores heuristiques ; ce n'est pas un audit Lighthouse complet. Renommer et présenter clairement ces contrôles, ou intégrer un véritable outil d'audit si c'est l'objectif du tableau de bord.  
  Références : [health.js](./src/utils/health.js), [Dashboard.jsx](./src/components/Admin/Dashboard/Dashboard.jsx).

- [ ] **Ajouter des tests ciblés.** Il n'y a pas de script de test déclaré. Après correction des bugs SQL, du mapping avatar et des états de chargement/erreur, ajouter des tests pour ces comportements et documenter la commande de validation.

## Journal des validations

| Date | Vérification | Résultat |
|---|---|---|
| 2026-11-24 | `npm run build` | Réussi ; avertissements sur les gros chunks, `caniuse-lite` ancien et `eval` dans une dépendance Lottie. |
| 2026-11-24 | `npm run lint` | Échec au démarrage : `eslint` n'est pas reconnu. |
| 2026-11-24 | Inspection du site public | Blocages CSP/COEP observés ; contenu dynamique incomplet au moment de la capture. |
| 2026-11-24 | Refonte visuelle — `npm run build` | Réussi ; avertissements préexistants sur les gros chunks, `caniuse-lite` ancien et `eval` dans Lottie. |
| 2026-11-24 | Aperçu local redesign | Rendu contrôlé desktop/mobile et en mode sombre ; navigation mobile vérifiée, 4 projets chargés et aucune largeur de document excédentaire constatée. |
| 2026-11-24 | Contraste et icônes sociales | Vérification du rendu/computed styles des textes en mode clair/sombre et des icônes sociales sur l'aperçu local. |
| 2026-11-24 | Page projets et pied de page | Build réussi ; smoke test navigateur sur données simulées : navigation `/projects`, détail avec/sans lien, email complet et absence de débordement mobile vérifiés. |
| 2026-11-24 | Données Supabase | Import de Turso écarté par choix utilisateur ; les contenus seront recréés dans l'admin. |
| 2026-11-24 | Lighthouse / tests automatisés | Non exécutés. |
| 2026-11-26 | `npm run lint` | Réussi ; ESLint installé, configuré (node globals, browser globals) et toutes les erreurs corrigées (29 erreurs, 4 warnings). |
| 2026-11-26 | CSP/COEP headers | Corrigés dans vercel.json et netlify.toml : COEP → credentialless, domaines ipapi.co et GA ajoutés. |
| 2026-11-26 | GA unifié | Variable VITE_GA_MEASUREMENT_ID utilisée ; ID hardcodé retiré d'index.html. |
| 2026-11-26 | Métriques fictives | Taux de conversion aléatoires supprimés des cartes projets (Math.random remplacé par useState). |
| 2026-11-26 | Turso token retiré du bundle | Toutes les opérations Turso (analytics, Dashboard, Projects, Skills, Testimonials, About, Hero, Admin CRUD) déplacées vers API routes Vercel (/api/...). Chunk turso.js (88 kB) éliminé du bundle client. |
| 2026-11-26 | Page Actualités fiabilisée | États erreur/retry, état vide, pagination, reset page sur changement catégorie, loading indicator. |
| 2026-11-26 | EmailJS échec explicite | Vérification config au mount, warning si vars manquantes, fallback contacts directs (email, WhatsApp), désactivation formulaire si config absente. |
