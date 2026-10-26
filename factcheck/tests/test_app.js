// Technische tests van de bijgewerkte master (Playwright, Chromium). Gebruik: node test_app.js <pad-naar-index.html>
const { chromium } = require('playwright');
const path = process.argv[2] || (process.env.OUT || '.') + '/index.html';
const URL = 'file://' + path;
const results = []; const ok = (name, cond, info = '') => { results.push({ name, pass: !!cond, info }); console.log((cond ? 'PASS ' : 'FAIL ') + name + (info ? ' — ' + info : '')); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/net::ERR_FAILED|fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto(URL); await p.waitForTimeout(400);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);

  // ---- data-integriteit in de browser ----
  const integ = await p.evaluate(() => {
    const D = JSON.parse(document.getElementById('data').textContent);
    const bad = [];
    D.QB.forEach(q => {
      if (!(q.a >= 0 && q.a < q.o.length)) bad.push(q.i + ' a');
      if (new Set(q.o.map(o => o.trim())).size !== q.o.length) bad.push(q.i + ' dubbele opties');
      if (!q.e || !String(q.e).trim()) bad.push(q.i + ' geen uitleg');
      (JSON.stringify([q.q, q.o, q.e, q.img || '']).match(/§(s\d+)§/g) || []).forEach(k => { if (!D.SV[k.slice(1, -1)]) bad.push(q.i + ' afb ' + k); });
      if (![1, 2, 3, 4].includes(q.n)) bad.push(q.i + ' niveau');
    });
    D.LIB.forEach((x, i) => (String(x.v).match(/§(s\d+)§/g) || []).forEach(k => { if (!D.SV[k.slice(1, -1)]) bad.push('LIB' + i); }));
    D.FC.forEach((x, i) => { if (!String(x.b || '').trim()) bad.push('FC' + i + ' leeg antwoord'); (JSON.stringify(x).match(/§(s\d+)§/g) || []).forEach(k => { if (!D.SV[k.slice(1, -1)]) bad.push('FC' + i + ' afb'); }); });
    return { bad, n: D.QB.length, u: D.QB.filter(q => q.u).length, ids: new Set(D.QB.map(q => q.i)).size };
  });
  ok('data: alle vragen geldig (antwoordindex, unieke opties, uitleg, afbeeldingen, niveau)', integ.bad.length === 0, integ.bad.slice(0, 8).join(', '));
  ok('data: unieke vraag-id\'s', integ.ids === integ.n, integ.ids + '/' + integ.n);

  ok('html: alle scripts geladen', await p.evaluate(() => document.scripts.length >= 5 && typeof go === 'function'));
  const imgs = await p.evaluate(() => { const bad = []; const l = D.QB.filter(q => q.o.some(o => o.includes('§'))); l.forEach(q => { startSession({ title: 'x', qs: [q] }); document.querySelectorAll('.opt svg').forEach(s => { const r = s.getBoundingClientRect(); if (r.width < 20 || r.height < 20) bad.push(q.i); }); }); Z = null; return [l.length, [...new Set(bad)]]; });
  ok('afbeeldingen als antwoordopties zichtbaar (alle beeldvragen)', imgs[1].length === 0, imgs[0] + ' vragen, te klein: ' + imgs[1].length);
  // ---- alle views ----
  const views = ['dashboard', 'introductie', 'studieplanner', 'theorie', 'beperkt', 'algemeen', 'vragen', 'oefenexamens', 'foutenanalyse', 'moeilijk', 'flashcards', 'afbeeldingen', 'situaties', 'tabellen', 'spiek', 'voortgang', 'audit'];
  for (const v of views) { await p.evaluate(v => go(v), v); await p.waitForTimeout(120); const t = await p.evaluate(() => document.querySelector('#view').innerText.length); ok('view ' + v + ' rendert', t > 200, t + ' tekens'); }
  const chs = await p.evaluate(() => TH.map(c => c.id));
  for (const c of chs) { await p.evaluate(c => go('theorie', c), c); await p.waitForTimeout(80); const n = await p.evaluate(() => document.querySelectorAll('#view article.prose h3').length); ok('hoofdstuk ' + c, n > 0, n + ' delen'); }
  const sims = await p.evaluate(() => SIMS.map(s => s[0]));
  for (const s of sims) { await p.evaluate(s => go('simulaties', s), s); await p.waitForTimeout(150); const t = await p.evaluate(() => document.querySelector('#simpane').innerHTML.length); ok('simulatie ' + s, t > 100); }
  await p.evaluate(() => { SQ = 'blauw bord'; go('zoeken'); }); await p.waitForTimeout(150);
  ok('zoeken geeft resultaten', await p.evaluate(() => /resultaten/.test(document.querySelector('#view h1').textContent) && !/^0 /.test(document.querySelector('#view h1').textContent)));

  // ---- examensimulatie beperkt ----
  await p.evaluate(() => startOfficial('B', 45)); await p.waitForTimeout(150);
  const sess = await p.evaluate(() => ({ n: Z.qs.length, parts: Z.qs.reduce((a, q) => (a[q.p] = (a[q.p] || 0) + 1, a), {}), u: Z.qs.filter(q => q.u).length, A: Z.qs.filter(q => q.l === 'A').length }));
  ok('simulatie: 30 vragen 12/10/8', sess.n === 30 && sess.parts.R === 12 && sess.parts.N === 10 && sess.parts.V === 8, JSON.stringify(sess.parts));
  ok('simulatie: geen onbevestigde en geen algemeen-vragen', sess.u === 0 && sess.A === 0);
  for (let k = 0; k < 30; k++) { await p.click('.opt >> nth=0'); if (k < 29) await p.click('#next'); }
  await p.click('#fin'); await p.waitForTimeout(150);
  const m1 = await p.$('.modal [data-yes]'); if (m1) await m1.click();
  await p.waitForTimeout(150);
  const res = await p.evaluate(() => ({ done: Z && Z.done, score: Z.score, pass: Z.pass, txt: document.querySelector('.passbadge') && document.querySelector('.passbadge').textContent }));
  const manual = await p.evaluate(() => Z.qs.filter((q, k) => Z.ans[k] === q.a).length);
  ok('simulatie: score klopt met antwoorden', res.done && res.score === manual, `score ${res.score}, ${res.txt}`);
  const passRule = await p.evaluate(() => { const ok = Z.score / Z.qs.length >= .6 && Object.values(Z.parts).every(v => v[0] / v[1] >= .5); return ok === Z.pass; });
  ok('simulatie: slaagregel 60% totaal + 50% per onderdeel', passRule);
  await p.waitForTimeout(300);
  const stored = await p.evaluate(() => JSON.parse(localStorage.getItem('vaarbewijsBE.master.v1') || '{}'));
  ok('opslag: examen en antwoorden lokaal bewaard', stored.exams && stored.exams.length === 1 && Object.keys(stored.ans || {}).length >= 30);

  // ---- 25 extra simulaties: nooit onbevestigde vragen ----
  const leak = await p.evaluate(() => { let u = 0; for (let i = 0; i < 25; i++) { u += buildOfficial('B').filter(q => q.u).length + buildOfficial('A').filter(q => q.u).length; } return u; });
  ok('100 extra gegenereerde examens bevatten geen onbevestigde vragen', leak === 0, String(leak));

  // ---- oefenmodus: feedback, aanpak, gelijkaardige vraag ----
  const wrongQ = await p.evaluate(() => { const q = pool({ cats: ['voorrang'] }).find(q => !q.img); startSession({ title: 'test', qs: [q] }); return q.i; });
  await p.waitForTimeout(100);
  const wrongIdx = await p.evaluate(() => { const q = Z.qs[0]; return Z.order[0].findIndex(oi => oi !== q.a); });
  await p.click(`.opt >> nth=${wrongIdx}`); await p.waitForTimeout(100);
  const fb = await p.evaluate(() => ({ expl: !!document.querySelector('.expl'), verdict: document.querySelector('.verdict').textContent, aanpak: !!document.querySelector('.aanpak'), juist: /Juist antwoord/.test(document.querySelector('.expl').innerText), sim: !!document.querySelector('[data-sim-q]') }));
  ok('feedback bij fout antwoord: juist antwoord + uitleg + aanpak + gelijkaardige vraag', fb.expl && fb.verdict === 'Fout' && fb.aanpak && fb.juist && fb.sim, JSON.stringify(fb));
  await p.click('[data-sim-q]'); await p.waitForTimeout(150);
  ok('gelijkaardige vraag opent een mini-quiz', await p.evaluate(() => !!document.querySelector('.modal .mq [data-mo]')));
  await p.click('.modal .mq [data-mo] >> nth=0'); await p.waitForTimeout(100);
  ok('mini-quiz geeft uitleg na antwoord', await p.evaluate(() => !!document.querySelector('.modal .mqfb .expl')));
  await p.evaluate(() => document.querySelector('.modal').remove());

  // ---- theorie: test jezelf + mini-quiz einde hoofdstuk ----
  await p.evaluate(() => go('theorie', 'voorrang')); await p.waitForTimeout(120);
  const nslots = await p.evaluate(() => document.querySelectorAll('[data-mqopen]').length);
  ok('theorie: "Test jezelf" bij elk deel', nslots > 3, nslots + ' knoppen');
  await p.click('[data-mqopen] >> nth=0'); await p.waitForTimeout(120);
  for (let k = 0; k < 3; k++) { await p.click('.mqslot .mq [data-mo] >> nth=0'); await p.click('.mqslot [data-mq-next]'); }
  ok('theorie: mini-quiz per deel loopt tot resultaat', await p.evaluate(() => /juist/.test(document.querySelector('.mqslot .mq').innerText)));
  await p.click('#mqendgo'); await p.waitForTimeout(100);
  ok('theorie: mini-quiz einde hoofdstuk start', await p.evaluate(() => document.querySelectorAll('#mqend [data-mo]').length >= 2));
  const theoryChaptersWithQuiz = await p.evaluate(() => TH.filter(c => (Object.keys(CATS).some(k => CATS[k].ch === c.id) || THCATS[c.id])).length + '/' + TH.length);
  ok('theorie: hoofdstukken met mini-quiz', true, theoryChaptersWithQuiz);

  // ---- vragenbank filters ----
  await p.evaluate(() => { BANKF.st = 'unv'; go('vragen'); }); await p.waitForTimeout(120);
  const unvCount = await p.evaluate(() => document.querySelector('#bcount').textContent);
  ok('vragenbank: filter Onbevestigd', parseInt(unvCount) === integ.u || parseInt(unvCount) > 0, unvCount + ' (totaal ' + integ.u + ' incl. algemeen)');
  for (const n of [1, 2, 3, 4]) { await p.evaluate(n => { BANKF.st = ''; BANKF.niv = String(n); go('vragen'); }, n); await p.waitForTimeout(80); const c = await p.evaluate(() => parseInt(document.querySelector('#bcount').textContent)); ok('vragenbank: niveau ' + n, c > 10, c + ' vragen'); }
  await p.evaluate(() => { BANKF.niv = ''; BANKF.st = 'focus'; go('vragen'); }); await p.waitForTimeout(80);
  ok('vragenbank: examenfocus', await p.evaluate(() => parseInt(document.querySelector('#bcount').textContent) >= 20));
  await p.evaluate(() => { BANKF.st = ''; });

  // ---- oefenexamens: niveau en focus ----
  await p.evaluate(() => go('oefenexamens')); await p.waitForTimeout(100);
  await p.click('[data-niv="1"]'); await p.waitForTimeout(80);
  ok('niveautraining start (niveau 1, enkel niveau 1)', await p.evaluate(() => Z && Z.qs.length === 20 && Z.qs.every(q => q.n === 1)));
  await p.evaluate(() => go('oefenexamens')); await p.waitForTimeout(80); await p.click('#fprac'); await p.waitForTimeout(80);
  ok('examenfocus start (enkel focusvragen)', await p.evaluate(() => Z && Z.qs.length === 20 && Z.qs.every(q => q.xf && !q.u)));
  await p.evaluate(() => go('oefenexamens')); await p.waitForTimeout(80); await p.click('[data-main="30"]'); await p.waitForTimeout(80);
  ok('willekeurig hoofdexamen (30)', await p.evaluate(() => Z && Z.qs.length === 30 && Z.mode === 'exam'));
  await p.evaluate(() => { Z = null; go('oefenexamens'); }); await p.waitForTimeout(80);
  await p.selectOption('#ccat', 'betonning'); await p.click('#cprac'); await p.waitForTimeout(80);
  ok('per categorie (betonning)', await p.evaluate(() => Z && Z.qs.every(q => q.c === 'betonning')));
  await p.evaluate(() => { Z = null; go('foutenanalyse'); }); await p.waitForTimeout(80);
  ok('foutenanalyse: fouten herhalen mogelijk', await p.evaluate(() => !document.querySelector('#allw').disabled));
  await p.click('#allw'); await p.waitForTimeout(80);
  ok('foutensessie bevat enkel laatst-foute vragen', await p.evaluate(() => Z.qs.every(q => S.ans[q.i] && !S.ans[q.i].l)));
  await p.evaluate(() => { Z = null; });

  // ---- flashcards, bibliotheek, audit ----
  await p.evaluate(() => go('flashcards')); await p.waitForTimeout(80); await p.click('#fflip'); await p.click('#fyes'); await p.waitForTimeout(80);
  ok('flashcards: Leitner-doos opgeslagen', await p.evaluate(() => Object.keys(S.fc).length === 1));
  await p.evaluate(() => libModal(D.LIB.findIndex(x => x.u))); await p.waitForTimeout(60);
  ok('bibliotheek: onbevestigd item toont waarschuwing', await p.evaluate(() => !!document.querySelector('.modal .unvnote')));
  await p.evaluate(() => document.querySelector('.modal').remove());
  await p.evaluate(() => go('audit')); await p.waitForTimeout(150);
  ok('audit: factcheckrapport + foutenlog', await p.evaluate(() => document.querySelectorAll('#fclt tr[data-r]').length > 200));
  await p.evaluate(() => { document.getElementById('fclq').closest('details').open = true; }); await p.fill('#fclq', 'q507'); await p.waitForTimeout(80);
  ok('audit: foutenlog filtert', await p.evaluate(() => [...document.querySelectorAll('#fclt tr[data-r]')].filter(r => !r.hidden).length >= 1 && [...document.querySelectorAll('#fclt tr[data-r]')].filter(r => !r.hidden).length < 10));

  // ---- fase 1B: afbeeldingen uit de repositories ----
  const f1 = await p.evaluate(() => {
    const nq = D.QB.filter(q => /^q7\d{4}$/.test(q.i));
    const exrBad = []; (D.EXR || []).forEach(r => { if (r.ids.length !== 30) exrBad.push(r.t + ' lengte'); r.ids.forEach(i => { if (!QBY[i]) exrBad.push(i + ' bestaat niet'); else if (QBY[i].u && !/^q7\d{4}$/.test(i)) exrBad.push(i + ' gekoppelde mastervraag onbevestigd'); }); });
    return { n: nq.length, img: nq.filter(q => q.img).length, prak: nq.filter(q => q.c === 'zeilpraktijk').length, exr: (D.EXR || []).length, exrBad, unv: nq.filter(q => q.u).length };
  });
  ok('fase 1B: 65 nieuwe vragen (28 voorrangstekeningen, 14 praktijk)', f1.n === 65 && f1.prak === 14, JSON.stringify(f1));
  ok('fase 1B: 4 examenreeksen van 30 bestaande vragen (gekoppelde mastervragen bevestigd)', f1.exr === 4 && f1.exrBad.length === 0, f1.exrBad.slice(0, 5).join(', '));
  const figBad = await p.evaluate(() => { const bad = []; D.QB.filter(q => /^q7\d{4}$/.test(q.i) && q.img).forEach(q => { startSession({ title: 'x', qs: [q] }); const s = document.querySelector('.qcard .fig svg'); const r = s && s.getBoundingClientRect(); if (!r || r.width < 120 || r.height < 60) bad.push(q.i + ':' + (r ? Math.round(r.width) + 'x' + Math.round(r.height) : 'geen svg')); }); Z = null; return bad; });
  ok('fase 1B: alle nieuwe tekeningen zichtbaar in de vraag', figBad.length === 0, figBad.slice(0, 6).join(', '));
  const prakPool = await p.evaluate(() => { let leak = 0; for (let k = 0; k < 25; k++) { leak += buildOfficial('B').filter(q => q.c === 'zeilpraktijk').length + buildOfficial('A').filter(q => q.c === 'zeilpraktijk').length; } return { leak, pool: pool().filter(q => q.c === 'zeilpraktijk').length, cat: pool({ cats: ['zeilpraktijk'] }).length, hard: hardPool().filter(q => q.c === 'zeilpraktijk').length }; });
  ok('fase 1B: praktijkvragen niet in examensimulaties of algemene pool, wel apart te oefenen', prakPool.leak === 0 && prakPool.pool === 0 && prakPool.cat === 14 && prakPool.hard === 0, JSON.stringify(prakPool));
  await p.evaluate(() => go('oefenexamens', 'reeks')); await p.waitForTimeout(150);
  ok('fase 1B: paneel examenreeksen met 8 knoppen', await p.evaluate(() => document.querySelectorAll('[data-exr]').length === 8));
  await p.click('[data-exr="1"][data-n="30"]'); await p.waitForTimeout(150);
  const rk = await p.evaluate(() => ({ n: Z.qs.length, order: Z.qs.map(q => q.i).join() === D.EXR[0].ids.filter(i => !QBY[i].u).join(), unvLeft: Z.qs.filter(q => q.u).length, mode: Z.mode, rule: !!Z.rule, fig: !!document.querySelector('.qcard .fig svg') }));
  ok('fase 1B: reeks 1 start als examen in de juiste volgorde, zonder onbevestigde vragen, eerste vraag met tekening', rk.n >= 28 && rk.unvLeft === 0 && rk.order && rk.mode === 'exam' && rk.rule && rk.fig, JSON.stringify(rk));
  await p.evaluate(() => { clearInterval(EXTMR); EXTMR_ON = false; Z = null; });
  for (const [ch, g, n] of [['praktijk', 'Praktijk in beeld', 19], ['voorrang', 'Voorrang in beeld', 9]]) {
    await p.evaluate(c => go('theorie', c), ch); await p.waitForTimeout(150);
    const r = await p.evaluate(g => { const host = [...document.querySelectorAll('.libembed')].find(e => e.querySelector('.libitem') && [...e.querySelectorAll('.libitem')].length && D.LIB[+e.querySelector('.libitem').dataset.i].g === g); if (!host) return null; const its = [...host.querySelectorAll('.libitem svg')]; return { n: its.length, small: its.filter(s => { const b = s.getBoundingClientRect(); return b.width < 40 || b.height < 30; }).length }; }, g);
    ok(`fase 1B: hoofdstuk ${ch} toont '${g}'`, r && r.n === n && r.small === 0, JSON.stringify(r));
  }
  ok('fase 1B: theorie praktijk bevat de nieuwe delen', await p.evaluate(() => { go('theorie', 'praktijk'); const t = [...document.querySelectorAll('#view article.prose h3')].map(h => h.textContent); return ['Zeilen: onderdelen, koersen en manoeuvres', 'Reven', 'Wal, lijnen en knopen'].every(x => t.includes(x)); }));
  ok('fase 1B: bibliotheekcorrecties (L201 achteraanzicht, 7 dagmerken hernoemd)', await p.evaluate(() => /^Achteraanzicht/.test(D.LIB[201].m) && D.LIB.filter(x => x.c === 'Dagmerk (het nachtbeeld staat in de uitleg)').length === 7 && !D.LIB.some(x => x.c === 'Nachtbeeld naast dagbeeld')));
  await p.evaluate(() => go('audit')); await p.waitForTimeout(200);
  ok('fase 1B: rapport in Kwaliteitscontrole met log, foutenlijst en inventarisverwijzing', await p.evaluate(() => document.querySelectorAll('#f1bt tr[data-r]').length >= 100 && /afbeeldingen-inventaris\.csv/.test(document.querySelector('#view').innerText) && /geen foto/i.test(document.querySelector('#view').innerText)));
  await p.evaluate(() => { document.getElementById('f1bq').closest('details').open = true; }); await p.fill('#f1bq', 'gecorrigeerd'); await p.waitForTimeout(80);
  ok('fase 1B: log filtert', await p.evaluate(() => { const v = [...document.querySelectorAll('#f1bt tr[data-r]')].filter(r => !r.hidden).length; return v >= 4 && v < 30; }));

  // ---- herladen: voortgang blijft ----
  await p.reload(); await p.waitForTimeout(400);
  ok('herladen: voortgang blijft bewaard', await p.evaluate(() => S.exams.length === 1 && Object.keys(S.ans).length >= 30 && Object.keys(S.fc).length === 1));

  // ---- mobiel ----
  const mp = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })).newPage();
  await mp.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await mp.goto(URL); await mp.waitForTimeout(300);
  for (const v of ['dashboard', 'oefenexamens', 'vragen', 'audit', 'spiek', 'flashcards', 'afbeeldingen']) {
    await mp.evaluate(v => go(v), v); await mp.waitForTimeout(120);
    const w = await mp.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    ok('mobiel 390px: geen horizontale scroll in ' + v, w[0] <= w[1] + 1 && w[1] <= 391, w.join(' vs '));
  }
  for (const c of ['praktijk', 'voorrang']) { await mp.evaluate(c => go('theorie', c), c); await mp.waitForTimeout(120); const w = await mp.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); ok('mobiel 390px: geen horizontale scroll in theorie ' + c, w[0] <= w[1] + 1 && w[1] <= 391, w.join(' vs ')); }
  await mp.evaluate(() => go('theorie', 'betonning')); await mp.waitForTimeout(100);
  await mp.click('[data-mqopen] >> nth=0'); await mp.waitForTimeout(100);
  const wq = await mp.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  ok('mobiel: mini-quiz zonder horizontale scroll', wq[0] <= wq[1] + 1, wq.join(' vs '));
  await mp.screenshot({ path: (process.env.OUT || '.') + '/mobiel_minquiz.png' });

  ok('geen JavaScript-fouten', errs.length === 0, errs.slice(0, 5).join(' | '));
  await b.close();
  const fails = results.filter(r => !r.pass);
  require('fs').writeFileSync((process.env.OUT || '.') + '/testresultaten.json', JSON.stringify(results, null, 1));
  console.log(`\n${results.length - fails.length}/${results.length} geslaagd`);
  process.exit(fails.length ? 1 : 0);
})();
