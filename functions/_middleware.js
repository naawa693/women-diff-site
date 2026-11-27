// Une seule adresse officielle pour Google : tout est redirigé vers https://womendiff.fr
// (women-diff.pages.dev et www.womendiff.fr). Les aperçus de déploiement Cloudflare restent accessibles.
const MAIN = 'womendiff.fr';
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const host = url.hostname;
  if (host === 'www.womendiff.fr' || host === 'women-diff.pages.dev') {
    url.hostname = MAIN;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
