# Site Women Diff

Site statique hébergé sur Cloudflare Pages.

- Pages : `index.html`, `projet.html`, `roster.html`, `recrutement.html`, `partenaires.html`, `contact.html`
- Contenus modifiables : `data/roster.json` (joueuses, staff) et `data/site.json` (contact, objectifs, recrutement, partenaires)
- Administration : `/admin` (Decap CMS, connexion GitHub)
- Connexion admin : `functions/api/auth.js` et `callback.js` (variables Cloudflare `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET`)

Mis à jour automatiquement : le dossier site-web du PC est publié par le bot à chaque déploiement.
