/* Women Diff : remplit les sections à partir de /data/roster.json et /data/site.json
   (modifiables depuis /admin ou par le bot Discord). */
(function () {
  var esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var $all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var fill = function (name, html) { $all('[data-render="' + name + '"]').forEach(function (el) { el.innerHTML = html; }); };
  var bind = function (name, text) { $all('[data-bind="' + name + '"]').forEach(function (el) { el.textContent = text; }); };
  var show = function (name, on) { $all('[data-show="' + name + '"]').forEach(function (el) { el.hidden = !on; }); };
  var getJSON = function (url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); });
  };

  var DISCORD_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#E9B8FF" aria-hidden="true" style="flex: none"><path d="M19.6 5.3A16.6 16.6 0 0 0 15.5 4l-.5 1a15.4 15.4 0 0 0-6 0L8.5 4a16.6 16.6 0 0 0-4.1 1.3C1.8 9.2 1.1 13 1.4 16.7a16.7 16.7 0 0 0 5 2.5l1.1-1.7a10.8 10.8 0 0 1-1.7-.8l.4-.3a11.9 11.9 0 0 0 11.6 0l.4.3a10.8 10.8 0 0 1-1.7.8l1.1 1.7a16.7 16.7 0 0 0 5-2.5c.4-4.3-.7-8-2.9-11.4ZM8.7 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/></svg>';

  function roster(r) {
    var players = (r.joueuses || []).filter(function (p) { return p.nom; });
    var staff = (r.staff || []).filter(function (p) { return p.nom; });
    var tit = 0;

    fill('players', players.map(function (p) {
      var sub = /sub/i.test(p.statut || '');
      var num = sub ? 'SUB' : String(++tit).padStart(2, '0');
      var roles = String(p.role || '').split(/[\/,·]/).map(function (r) { return r.trim(); }).filter(Boolean);
      if (p.igl && roles.indexOf('IGL') < 0) roles.push('IGL');
      var tracker = /^https?:\/\//i.test(p.tracker || '') ? p.tracker : '';
      var chip = function (t) {
        var gold = t === 'IGL';
        return '<span class="wd-chip' + (gold ? ' wd-chip-gold' : '') + '">' + esc(t) + '</span>';
      };
      return '<article class="wd-player" tabindex="0" aria-label="' + esc(p.nom) + (roles.length ? ', ' + esc(roles.join(', ')) : '') + '" style="border-radius: 24px; overflow: hidden; background: #140B20; border: 1px solid #2C1B40">' +
        '<div class="wd-ph" style="position: relative; height: 300px; overflow: hidden; background: #1F1230">' +
        '<img src="' + esc(p.photo) + '" alt="Photo de profil de ' + esc(p.nom) + '" loading="lazy" style="display: block; width: 100%; height: 100%; object-fit: cover">' +
        '<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(20, 11, 32, 0.95))"></span>' +
        '<span class="wd-num" style="position: absolute; top: 14px; left: 16px; font-family: Poppins, sans-serif; font-weight: 800; font-size: 30px; color: #FFFFFF; text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6)">' + num + '</span>' +
        '<div class="wd-ov">' +
        '<p class="wd-ov-lbl">' + (roles.length > 1 ? 'Rôles' : 'Rôle') + '</p>' +
        (roles.length ? '<div class="wd-chips">' + roles.map(chip).join('') + '</div>' : '<p class="wd-ov-none">Non renseigné</p>') +
        (tracker ? '<a href="' + esc(tracker) + '" target="_blank" rel="noopener" class="wd-ov-btn">Tracker Valorant ↗</a>' : '<p class="wd-ov-none">Tracker non renseigné</p>') +
        '</div>' +
        '</div>' +
        '<div style="padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 10px; min-width: 0">' +
        '<h2 style="margin: 0; font-family: Poppins, sans-serif; font-size: 22px; color: #FFFFFF">' + esc(p.nom) + '</h2>' +
        (p.discord ? '<div style="display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 12px; border-radius: 12px; background: #1F1230; border: 1px solid #2C1B40">' + DISCORD_SVG +
          '<span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; font-weight: 600; color: #FFFFFF">@' + esc(p.discord) + '</span></div>' : '') +
        '</div></article>';
    }).join('') +
      '<a href="/recrutement" class="wd-player" style="min-height: 420px; border-radius: 24px; border: 1px dashed #8B3DFF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 24px; text-align: center; text-decoration: none; color: #E9B8FF">' +
      '<span style="font-family: Poppins, sans-serif; font-weight: 800; font-size: 40px; color: #E86BF5">+</span>' +
      '<span style="font-family: Poppins, sans-serif; font-weight: 700; font-size: 20px; color: #FFFFFF">Ta place est ici</span>' +
      '<span style="font-size: 15px; color: #CFC3E0">On recrute : découvre les profils recherchés →</span></a>');

    fill('staff', staff.map(function (s) {
      return '<div class="wd-staff" style="display: flex; align-items: center; gap: 16px; padding: 20px 22px; border-radius: 18px; background: #140B20; border: 1px solid #2C1B40; min-width: 0">' +
        '<img src="' + esc(s.photo) + '" alt="Photo de profil de ' + esc(s.nom) + '" loading="lazy" style="flex: none; width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #8B3DFF">' +
        '<div style="min-width: 0"><p style="margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #FFC94A">' + esc(s.role) + '</p>' +
        '<p style="margin: 2px 0 0; font-family: Poppins, sans-serif; font-weight: 600; font-size: 19px; color: #FFFFFF">' + esc(s.nom) + '</p>' +
        (s.discord ? '<p style="margin: 2px 0 0; font-size: 14px; color: #E9B8FF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">Discord : <strong style="color: #FFFFFF">@' + esc(s.discord) + '</strong></p>' : '') +
        '</div></div>';
    }).join(''));

    fill('home-team', players.map(function (p, i) {
      var sub = /sub/i.test(p.statut || '');
      return '<a href="/roster" class="wd-pl wd-up wd-d' + Math.min(i + 1, 4) + '">' +
        '<img src="' + esc(p.photo) + '" alt="Photo de profil de ' + esc(p.nom) + '" loading="lazy">' +
        '<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(7, 4, 12, 0.92))"></span>' +
        (sub ? '<span style="position: absolute; top: 16px; right: 16px; padding: 4px 12px; border-radius: 999px; background: #8B3DFF; color: #FFFFFF; font-size: 12px; font-weight: 700; letter-spacing: .08em">SUB</span>' : '') +
        '<span style="position: absolute; left: 22px; right: 22px; bottom: 20px; display: flex; flex-direction: column; gap: 2px">' +
        '<span style="font-family: Poppins, sans-serif; font-weight: 800; font-size: 28px; color: #FFFFFF">' + esc(p.nom) + '</span>' +
        (p.discord ? '<span style="font-size: 14px; font-weight: 600; color: #E9B8FF">@' + esc(p.discord) + '</span>' : '') +
        '</span></a>';
    }).join(''));

    fill('avatar-stack', players.concat(staff.slice(0, 1)).slice(0, 5).map(function (p, i) {
      return '<img src="' + esc(p.photo) + '" alt="" style="width: 40px; height: 40px;' + (i ? ' margin-left: -12px;' : '') + ' border-radius: 50%; object-fit: cover; border: 2px solid #07040C">';
    }).join(''));

    bind('nb-joueuses', players.length);
    playerHover();
    bind('nb-staff', staff.length);
  }

  /* Survol d'une carte du Roster : la photo se floute et le profil (rôles, tracker) apparaît.
     Sur téléphone (pas de survol) : un appui sur la carte affiche/masque le profil. */
  function playerHover() {
    var grid = document.querySelector('[data-render="players"]');
    if (!grid || document.getElementById('wd-hover-css')) return;
    var css = document.createElement('style');
    css.id = 'wd-hover-css';
    css.textContent =
      '.wd-ph img{transition:filter .35s ease,transform .5s ease}' +
      '.wd-ov{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:22px;background:rgba(14,8,24,.55);opacity:0;transition:opacity .3s ease}' +
      '.wd-ov>*{transform:translateY(10px);transition:transform .35s cubic-bezier(.2,.7,.2,1)}' +
      '.wd-player:hover .wd-ph img,.wd-player:focus-within .wd-ph img,.wd-player.is-open .wd-ph img{filter:blur(10px) brightness(.7);transform:scale(1.12)}' +
      '.wd-player:hover .wd-ov,.wd-player:focus-within .wd-ov,.wd-player.is-open .wd-ov{opacity:1}' +
      '.wd-player:hover .wd-ov>*,.wd-player:focus-within .wd-ov>*,.wd-player.is-open .wd-ov>*{transform:none}' +
      '.wd-player:hover .wd-num,.wd-player:focus-within .wd-num,.wd-player.is-open .wd-num{opacity:0}.wd-num{transition:opacity .2s ease}' +
      '.wd-ov-lbl{margin:0;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#FFC94A}' +
      '.wd-chips{display:flex;flex-wrap:wrap;gap:8px}' +
      '.wd-chip{padding:6px 12px;border-radius:999px;background:rgba(42,24,64,.85);border:1px solid #6B4A95;color:#FFFFFF;font-size:14px;font-weight:600}' +
      '.wd-chip-gold{background:rgba(255,201,74,.16);border-color:#FFC94A;color:#FFC94A}' +
      '.wd-ov-none{margin:0;color:#CFC3E0;font-size:14px}' +
      '.wd-ov-btn{display:flex;align-items:center;justify-content:center;min-height:46px;margin-top:6px;border-radius:999px;background:linear-gradient(135deg,#8B3DFF,#E13CF0);color:#FFFFFF !important;font-weight:600;text-decoration:none;box-shadow:0 10px 26px rgba(139,61,255,.45)}' +
      '.wd-ov-btn:hover{filter:brightness(1.12)}' +
      '@media (prefers-reduced-motion: reduce){.wd-ph img,.wd-ov,.wd-ov>*{transition:none}}';
    document.head.appendChild(css);
    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      grid.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var c = e.target.closest('.wd-player');
        if (!c) return;
        grid.querySelectorAll('.wd-player.is-open').forEach(function (o) { if (o !== c) o.classList.remove('is-open'); });
        c.classList.toggle('is-open');
      });
    }
  }

  function site(d) {
    var c = d.contact || {}, rx = d.reseaux || {}, rec = d.recrutement || {}, pa = d.partenaires || {};

    // Contact + liens Discord
    bind('email-footer', c.email || '');
    $all('[data-bind="email-link"]').forEach(function (a) { a.textContent = c.email; a.href = 'mailto:' + c.email; });
    show('email', !!c.email);
    var invite = c.discord_invite || rx.discord || '';
    show('discord', !!invite);
    $all('[data-discord-link]').forEach(function (a) {
      if (invite) { a.href = invite; a.target = '_blank'; a.rel = 'noopener'; } else { a.href = '/contact'; }
    });
    $all('[data-social]').forEach(function (a) {
      var url = rx[a.getAttribute('data-social')] || (a.getAttribute('data-social') === 'discord' ? invite : '');
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; } else { a.hidden = true; }
    });
    // masque les colonnes vides du bas de page
    $all('.wd-foot [data-social]').slice(0, 1).forEach(function (a) {
      var col = a.parentElement;
      if (!col.querySelector('[data-social]:not([hidden])')) col.hidden = true;
    });
    $all('.wd-foot [data-bind="email-footer"]').forEach(function (p) { if (!c.email) p.parentElement.hidden = true; });

    // Objectifs
    fill('objectifs', (d.objectifs || []).map(function (o, i) {
      return '<li style="display: flex; gap: 14px; align-items: flex-start"><span style="flex: none; width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #8B3DFF, #E86BF5); display: flex; align-items: center; justify-content: center; font-family: Poppins, sans-serif; font-weight: 800; font-size: 14px; color: #FFFFFF">' + (i + 1) + '</span>' +
        '<span><strong style="display: block; color: #FFFFFF">' + esc(o.titre) + '</strong><span style="font-size: 15px; color: #CFC3E0">' + esc(o.texte) + '</span></span></li>';
    }).join(''));

    // Recrutement
    fill('profils', (rec.profils || []).map(function (p) {
      return '<article style="padding: 28px; border-radius: 22px; background: #140B20; border: 1px solid ' + (p.priorite ? '#8B3DFF' : '#2C1B40') + '">' +
        '<span style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: ' + (p.priorite ? '#6A2FCF' : '#2A1840') + '; color: ' + (p.priorite ? '#FFFFFF' : '#E9B8FF') + '; font-size: 12px; font-weight: 600">' + (p.priorite ? 'Priorité' : 'Ouvert') + '</span>' +
        '<h3 style="margin: 14px 0 6px; font-family: Poppins, sans-serif; font-size: 22px; color: #FFFFFF">' + esc(p.titre) + '</h3>' +
        '<p style="margin: 0; color: #CFC3E0">' + esc(p.texte) + '</p></article>';
    }).join(''));
    bind('rang', rec.rang || '');
    show('rang', !!rec.rang);
    fill('faq', (rec.faq || []).map(function (q, i) {
      return '<details class="wd-faq"' + (i === 0 ? ' open' : '') + ' style="border-radius: 18px; background: #140B20; border: 1px solid #2C1B40">' +
        '<summary style="min-height: 60px; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; color: #FFFFFF; font-weight: 600; font-size: 17px; cursor: pointer; list-style: none">' + esc(q.q) + '<span aria-hidden="true" class="wd-faq-sign" style="color: #E86BF5; font-size: 22px"></span></summary>' +
        '<p style="margin: 0; padding: 0 22px 20px; color: #CFC3E0">' + esc(q.a) + '</p></details>';
    }).join(''));

    // Partenaires
    var logos = (pa.logos || []).filter(function (l) { return l.logo || l.nom; });
    var tile = function (l, h, w) {
      var inner = l.logo ? '<img src="' + esc(l.logo) + '" alt="' + esc(l.nom) + '" style="max-width: 80%; max-height: 70%; object-fit: contain">' : '<span style="color: #FFFFFF; font-weight: 600">' + esc(l.nom) + '</span>';
      var st = 'height: ' + h + 'px;' + (w ? ' width: ' + w + 'px;' : '') + ' border-radius: 18px; border: 1px solid #2C1B40; background: #140B20; display: flex; align-items: center; justify-content: center; text-decoration: none';
      return l.lien ? '<a href="' + esc(l.lien) + '" target="_blank" rel="noopener" style="' + st + '">' + inner + '</a>' : '<div style="' + st + '">' + inner + '</div>';
    };
    fill('partners', logos.map(function (l) { return tile(l, 130); }).join('') +
      '<a href="/contact" style="height: 130px; border-radius: 20px; border: 1px dashed #8B3DFF; display: flex; align-items: center; justify-content: center; color: #E9B8FF; font-weight: 600; text-decoration: none">Votre logo ici</a>');
    fill('home-partners', logos.map(function (l) { return tile(l, 64, 170); }).join('') +
      '<a href="/partenaires" style="width: 170px; height: 64px; border-radius: 14px; border: 1px dashed #8B3DFF; display: flex; align-items: center; justify-content: center; color: #E9B8FF; font-size: 14px; font-weight: 600; text-decoration: none">Votre logo ici</a>');
    var prix = pa.prix || {};
    ['soutien', 'partenaire', 'principal'].forEach(function (k) { bind('prix-' + k, prix[k] || 'Sur devis'); });

    // Formulaire de contact (Formspree si configuré, sinon e-mail)
    var form = document.getElementById('c-form');
    if (form) {
      var ok = document.getElementById('c-ok'), err = document.getElementById('c-err');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        err.hidden = true;
        var data = new FormData(form);
        if (c.formspree) {
          fetch(c.formspree, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error(); form.reset(); form.hidden = true; ok.hidden = false; })
            .catch(function () { err.textContent = "L'envoi a échoué. Réessaie ou écris-nous sur Discord."; err.hidden = false; });
        } else if (c.email) {
          var body = 'Nom : ' + data.get('nom') + '\nE-mail : ' + data.get('email') + '\nProfil : ' + data.get('profil') + '\n\n' + data.get('message');
          location.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent('Contact site · ' + data.get('profil')) + '&body=' + encodeURIComponent(body);
        } else {
          err.textContent = 'Le formulaire arrive bientôt : en attendant, contacte-nous sur Discord.';
          err.hidden = false;
        }
      });
      var again = document.getElementById('c-again');
      if (again) again.addEventListener('click', function () { ok.hidden = true; form.hidden = false; });
    }
  }

  getJSON('/data/roster.json').then(roster).catch(function () {});
  getJSON('/data/site.json').then(site).catch(function () {});
})();
