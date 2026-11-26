// Retour de GitHub : échange le code contre un jeton et le transmet à Decap CMS.
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('Cookie') || '').match(/wd_oauth_state=([^;]+)/);

  let status = 'error';
  let content = { error: 'Connexion refusée.' };
  if (code && state && cookie && cookie[1] === state) {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'women-diff-site' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    const data = await r.json();
    if (data.access_token) {
      status = 'success';
      content = { token: data.access_token, provider: 'github' };
    } else {
      content = { error: data.error_description || 'Échec de la connexion GitHub.' };
    }
  }

  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const origin = url.origin;
  const html = `<!doctype html><html lang="fr"><body><p>Connexion…</p><script>
  (function () {
    function receive(e) {
      if (e.origin !== ${JSON.stringify(origin)}) return;
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener('message', receive);
      setTimeout(function () { window.close(); }, 300);
    }
    window.addEventListener('message', receive, false);
    window.opener && window.opener.postMessage('authorizing:github', ${JSON.stringify(origin)});
  })();
  </script></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'wd_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
