// Onafhankelijke linkcontrole: elke interne link/knop in elke weergave en elk hoofdstuk wordt gevolgd.
const { chromium } = require('playwright');
const path = process.argv[2];
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/net::ERR_FAILED|fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto('file://' + path); await p.waitForTimeout(400);
  const meta = await p.evaluate(() => ({ views: Object.keys(VIEWS), th: TH.map(c => c.id), sims: SIMS.map(s => s[0]), nav: [...document.querySelectorAll('.navlink')].map(n => [n.dataset.go, n.dataset.arg || '', n.textContent.trim().slice(0, 40)]) }));
  const routes = new Set(); const links = new Map();
  const collect = async (label) => {
    const l = await p.evaluate(() => {
      const out = []; document.querySelectorAll('#view a[href^="#"], #view [data-go], .side a[href^="#"]').forEach(a => {
        if (a.hasAttribute('data-go')) out.push(['go', a.dataset.go, a.dataset.arg || '']);
        else { const h = a.getAttribute('href').slice(1); if (h.startsWith('sim-')) out.push(['href', 'simulaties', h.slice(4)]); else { const [v, arg] = h.split('.'); out.push(['href', v, arg || '']); } }
      }); return out;
    });
    l.forEach(x => { const k = x[1] + '.' + x[2]; if (!links.has(k)) links.set(k, new Set()); links.get(k).add(label); });
  };
  // verzamel links in elke weergave + elk hoofdstuk + elke simulatie
  for (const v of meta.views) { if (['sessie', 'zoeken'].includes(v)) continue; await p.evaluate(v => go(v), v); await p.waitForTimeout(60); await collect(v); }
  for (const c of meta.th) { await p.evaluate(c => go('theorie', c), c); await p.waitForTimeout(40); await collect('theorie.' + c); }
  for (const s of meta.sims) { await p.evaluate(s => go('simulaties', s), s); await p.waitForTimeout(60); await collect('sim.' + s); }
  for (const n of meta.nav) { const k = n[0] + '.' + n[1]; if (!links.has(k)) links.set(k, new Set()); links.get(k).add('nav'); }
  const bad = []; let tested = 0;
  for (const [k, from] of links) {
    const [v, ...rest] = k.split('.'); const arg = rest.join('.');
    const res = await p.evaluate(([v, arg]) => {
      if (!VIEWS[v]) return { err: 'weergave bestaat niet' };
      try { go(v, arg); } catch (e) { return { err: 'fout: ' + e.message }; }
      const el = document.querySelector('#view'); const t = el.innerText.length;
      let argOk = true, why = '';
      if (v === 'theorie' && arg && !TH.some(c => c.id === arg)) { argOk = false; why = 'onbekend hoofdstuk'; }
      if (v === 'simulaties' && arg && !SIMS.some(s => s[0] === arg)) { argOk = false; why = 'onbekende simulatie'; }
      return { t, argOk, why, h: (el.querySelector('h1') || {}).textContent };
    }, [v, arg]);
    tested++;
    if (res.err || !res.argOk || res.t < 150) bad.push({ link: k, from: [...from].slice(0, 4), res });
  }
  console.log(JSON.stringify({ views: meta.views.length, chapters: meta.th.length, sims: meta.sims.length, uniqueLinks: links.size, tested, bad, errs: errs.slice(0, 10) }, null, 1));
  await b.close(); process.exit(bad.length || errs.length ? 1 : 0);
})();
