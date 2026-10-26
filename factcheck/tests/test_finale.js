// Tests van de finale dubbele controle (26-10-2026).
// Gebruik: node test_finale.js <nieuwe index.html> <vorige index.html (index_before.html)>
const { chromium } = require('playwright');
const fs = require('fs');
const NEW = process.argv[2] || (process.env.OUT || '.') + '/index_finale.html';
const OLD = process.argv[3] || '/home/claude/work/final/index_before.html';
const results = []; const ok = (name, cond, info = '') => { results.push({ name, pass: !!cond, info }); console.log((cond ? 'PASS ' : 'FAIL ') + name + (info ? ' — ' + info : '')); };
const grab = (h, id) => JSON.parse(h.match(new RegExp('<script type="application/json" id="' + id + '">(.*?)</script>', 's'))[1]);
const theory = h => h.match(/<template id="theory">(.*?)<\/template>/s)[1];
const strip = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/§s\d+§/g, '[afb]').replace(/\s+/g, ' ').trim();

(async () => {
  const hn = fs.readFileSync(NEW, 'utf8'), ho = fs.readFileSync(OLD, 'utf8');
  const Dn = grab(hn, 'data'), Do = grab(ho, 'data'), An = grab(hn, 'audit'), Ao = grab(ho, 'audit');
  const F = An.finale;
  const logText = F.log.map(l => l.plaats + ' ' + l.origineel).join('\n');

  // ---------- A. regressie: er is niets verdwenen ----------
  const Qo = new Map(Do.QB.map(q => [q.i, q])), Qn = new Map(Dn.QB.map(q => [q.i, q]));
  ok('alle ' + Do.QB.length + ' vroegere vragen bestaan nog', [...Qo.keys()].every(i => Qn.has(i)));
  ok('geen dubbele vraag-id', Qn.size === Dn.QB.length);
  const KEYS = ['c', 'l', 'p', 'q', 'o', 'a', 'e', 't', 'r', 'img', 'n', 'u', 'uw', 'us', 'f', 'h'];
  const changed = [...Qo.keys()].filter(i => KEYS.some(k => JSON.stringify(Qo.get(i)[k]) !== JSON.stringify(Qn.get(i)[k])));
  const unlogged = changed.filter(i => !new RegExp('vraag ' + i + ' ').test(logText));
  ok('elke gewijzigde vraag staat in het finale logboek (' + changed.length + ' gewijzigd)', unlogged.length === 0, unlogged.join(','));
  ok('aantal gewijzigde vragen komt overeen met de teller in het rapport', changed.length === F.counts.edits, changed.length + ' vs ' + F.counts.edits);
  const newIds = Dn.QB.filter(q => !Qo.has(q.i)).map(q => q.i);
  ok('nieuwe vragen: ' + newIds.length + ' = teller', newIds.length === F.counts.nieuw_qb);
  ok('alle nieuwe vragen dragen bron en label "finale controle"', newIds.every(i => Qn.get(i).fs && (Qn.get(i).s || []).some(x => /finale controle/.test(x))));
  ok('nieuwe vragen: antwoord in bereik, unieke opties, uitleg aanwezig', newIds.every(i => { const q = Qn.get(i); return q.a >= 0 && q.a < q.o.length && new Set(q.o.map(strip)).size === q.o.length && strip(q.e).length > 20; }));
  ok('Brussel-Schelde-vragen (' + F.counts.nieuw_qb_unv + ') zijn ONBEVESTIGD', newIds.filter(i => Qn.get(i).u).length === F.counts.nieuw_qb_unv && newIds.filter(i => Qn.get(i).u).every(i => /Brussel/.test(strip(Qn.get(i).q))));
  ok('elke ONBEVESTIGDE vraag heeft een reden (uw)', Dn.QB.filter(q => q.u).every(q => strip(q.uw).length > 20), 'onbevestigd: ' + Dn.QB.filter(q => q.u).length);
  // rekenvragen opnieuw uitgerekend
  const get = i => Qn.get(i); const ans = i => strip(get(i).o[get(i).a]);
  ok('q80002: sluis 90 × 12 → maximaal 89,70 × 11,80; antwoord 89,60 × 11,75 past, afleiders niet', ans('q80002') === 'Lengte 89,60 m, breedte 11,75 m' && get('q80002').o.filter((o, k) => k !== get('q80002').a).every(o => { const m = strip(o).match(/(\d+,\d+) m.*?(\d+,\d+) m/); const L = +m[1].replace(',', '.'), B = +m[2].replace(',', '.'); return L > 89.70 || B > 11.80; }));
  ok('q80004: 4,50 − 4,25 = 0,25 < 0,30 → Nee', /^Nee/.test(ans('q80004')));
  ok('q80032: 10 + 3 = 13 km/u', ans('q80032') === '13 km/u');
  ok('q80034: 2,40 + 0,30 − 0,90 = 1,80 m', ans('q80034') === '1,80 m');
  ok('q80012: Maas 9 km/u rechterhelft; q80011: 16 km/u', ans('q80012') === '9 km/u' && /^16 km\/u/.test(ans('q80011')));
  // flashcards, bibliotheek, situaties, afbeeldingen, examenreeksen
  const nfc = F.counts.nieuw_fc;
  ok('flashcards: ' + Do.FC.length + ' + ' + nfc + ' = ' + Dn.FC.length, Dn.FC.length === Do.FC.length + nfc);
  const fcChanged = Do.FC.map((x, i) => JSON.stringify(x) !== JSON.stringify(Dn.FC[i]) ? i : -1).filter(i => i >= 0);
  ok('bestaande flashcards: alleen de gelogde zijn gewijzigd (' + fcChanged.join(',') + ')', fcChanged.every(i => F.log.some(l => l.plaats.startsWith('flashcard ' + i + ' '))) && fcChanged.length >= 3);
  ok('bibliotheek ongewijzigd (' + Do.LIB.length + ')', JSON.stringify(Do.LIB) === JSON.stringify(Dn.LIB));
  ok('tekeningen (SV) ongewijzigd (' + Object.keys(Do.SV).length + ')', JSON.stringify(Do.SV) === JSON.stringify(Dn.SV));
  ok('examenreeksen en examenfocus ongewijzigd', JSON.stringify(Do.EXR) === JSON.stringify(Dn.EXR) && JSON.stringify(Do.FOCUS) === JSON.stringify(Dn.FOCUS));
  const sitChanged = Do.SIT.map((x, i) => JSON.stringify(x) !== JSON.stringify(Dn.SIT[i]) ? i : -1).filter(i => i >= 0);
  ok('situaties: alleen S27 gewijzigd, 30 aanwezig', Dn.SIT.length === 30 && sitChanged.join(',') === '27' && Dn.SIT[27].steps.length === Do.SIT[27].steps.length + 1);
  ok('examenreeksen: alle vragen bestaan nog', Dn.EXR.every(e => e.ids.every(i => Qn.has(i))));
  // theorie: geen kopje of hoofdstuk verdwenen
  const To = theory(ho), Tn = theory(hn);
  const heads = t => [...t.matchAll(/<h3>(.*?)<\/h3>/gs)].map(m => strip(m[1]));
  const secs = t => [...t.matchAll(/<section data-ch="([^"]+)"/g)].map(m => m[1]);
  ok('theorie: alle ' + heads(To).length + ' kopjes en ' + secs(To).length + ' hoofdstukken nog aanwezig', heads(To).every(x => heads(Tn).includes(x)) && secs(To).every(x => secs(Tn).includes(x)) && secs(Tn).length === secs(To).length);
  ok('theorie: drie nieuwe delen (ARS, Maas, dieptemeter en log)', ['Algemeen Reglement der Scheepvaartwegen (1935)', 'Dieptemeter en log'].every(x => heads(Tn).includes(x)) && heads(Tn).length === heads(To).length + F.counts.nieuw_theorie, heads(Tn).filter(x => !heads(To).includes(x)).join(' | '));
  const words = t => strip(t).split(' ').length;
  ok('theorie: omvang niet gekrompen (' + words(To) + ' → ' + words(Tn) + ' woorden)', words(Tn) >= words(To));
  // specifieke inhoudelijke correcties in de theorie
  const T = strip(Tn);
  ok('theorie: IALA-B-nuance bij "de vorm liegt nooit"', /stomp is rood, spits is groen \(SIGNI en IALA-A\)\. In IALA-B/.test(T));
  ok('theorie: dubbele "(art. 3.13 lid 6)" in één cel opgeruimd', !/tijdig wordt getoond \(art\. 3\.13 lid 6\)/.test(T));
  ok('theorie: COLREG 18 zonder "door diepgang beperkt" in de ladder', /beperkt manoeuvreerbaar > vissend > zeil > motor\. Een schip dat door zijn diepgang beperkt is/.test(T));
  ok('theorie: "inschrijven vanaf 15" is ONBEVESTIGD gemarkeerd', /vanaf 15 ONBEVESTIGD/.test(T));
  ok('theorie: marifoon: 5 jaar, dualwatch en 1 W volgens BIPT-handleiding', /na 5 jaar vernieuwd/.test(T) && /ten hoogste 1 W/.test(T) && /Dualwatch In de binnenvaart verboden/.test(T));
  ok('theorie: schutten toont melding dat art. 6.28 niet gelezen is', /Artikel 6\.28 APSB kon niet in de Belgische tekst gelezen worden/.test(T));
  ok('theorie: ARS-tabel (0,30 / 0,20 / 0,30 / 200 m)', /minstens 0,30 m korter/.test(T) && /minstens 0,20 m smaller/.test(T) && /op minstens 200 m/.test(T));
  ok('theorie: Maas 16 km/u, 9 km/u, 6.33c', /16 km\/u ten opzichte van de oever/.test(T) && /9 km\/u/.test(T) && /6\.33c/.test(T));
  // rapport-gegevens
  ok('register: ' + F.register.length + ' regels met geldige status', F.register.length === F.counts.register && F.register.every(r => /^(BEVESTIGD|VEREENVOUDIGD|VUISTREGEL|NIET BRONGECONTROLEERD|ONBEVESTIGD)/.test(r.status)));
  ok('register: elke regel heeft een bron of status ONBEVESTIGD/NIET BRONGECONTROLEERD/VEREENVOUDIGD', F.register.every(r => (r.bron && r.bron !== '–') || /^(ONBEVESTIGD|NIET BRONGECONTROLEERD|VEREENVOUDIGD|VUISTREGEL)/.test(r.status)), F.register.filter(r => !((r.bron && r.bron !== '–') || /^(ONBEVESTIGD|NIET BRONGECONTROLEERD|VEREENVOUDIGD|VUISTREGEL)/.test(r.status))).map(r => r.regel.slice(0, 40)).join(' | '));
  ok('register: BEVESTIGD zonder bron komt niet voor', !F.register.some(r => /^BEVESTIGD/.test(r.status) && (!r.bron || r.bron === '–')));
  ok('open punten: ' + F.open.length + ' met onderwerp, reden en voorstel', F.open.length === F.counts.open && F.open.every(o => o.onderwerp && o.waarom && o.voorstel));
  ok('logboek: ' + F.log.length + ' regels, doorlopend genummerd', F.log.every((l, i) => l.nr === i + 1 && l.plaats && l.fout && l.bron !== undefined));
  ok('logboek: elke wijziging noemt een reden en een bron', F.log.every(l => String(l.fout).length > 10 && (String(l.bron).length > 1)), F.log.filter(l => !(String(l.fout).length > 10 && String(l.bron).length > 1)).map(l => l.nr).join(','));
  ok('bronnenlijst: ' + F.sources.length + ' bronnen, S26 en S27 aanwezig', F.sources.length >= 11 && F.sources.some(s => /^S26 /.test(s)) && F.sources.some(s => /^S27 /.test(s)));

  // ---------- B. in de browser ----------
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/net::ERR_FAILED|fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto('file://' + NEW); await p.waitForTimeout(400);
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);

  // dashboard-tekst
  const dash = await p.evaluate(() => { go('dashboard'); return document.querySelector('#view').innerText; });
  ok('dashboard: noemt finale controle en onbevestigde vragen, niet meer "gecontroleerde examenvragen"', /finale controle van 26-10-2026/.test(dash) && /nog onbevestigd/.test(dash) && !/gecontroleerde examenvragen/.test(dash), dash.match(/Alle leerstof[^\n]*/)[0].slice(0, 260));
  const intro = await p.evaluate(() => { go('introductie'); return document.querySelector('#view').innerText; });
  ok('introductie: grenzen van de controle genoemd', /voor zover die online leesbaar was/.test(intro) && /ONBEVESTIGD gemarkeerd/.test(intro));

  // onbevestigde vragen blijven uit examens en pools
  const leak = await p.evaluate(() => { let u = 0, n = 0; for (let i = 0; i < 40; i++) { const a = buildOfficial('B').concat(buildOfficial('A')); u += a.filter(q => q.u).length; n += a.length; } return { u, n, pool: pool().filter(q => q.u).length, incU: pool({ incU: true }).filter(q => q.u).length }; });
  ok('onbevestigde vragen lekken niet naar examens of pool', leak.u === 0 && leak.pool === 0 && leak.incU === Dn.QB.filter(q => q.u && q.c !== 'zeilpraktijk' && q.l === 'B').length, JSON.stringify(leak));
  const newInExam = await p.evaluate(ids => { const seen = new Set(); for (let i = 0; i < 150; i++) buildOfficial('B').concat(buildOfficial('A')).forEach(q => { if (ids.includes(q.i)) seen.add(q.i); }); return [...seen]; }, newIds);
  ok('nieuwe, bevestigde vragen komen in examens voor, de onbevestigde niet', newInExam.length >= 10 && newInExam.every(i => !Qn.get(i).u), newInExam.length + ' van ' + newIds.filter(i => !Qn.get(i).u).length + ' gezien in 150 examens');

  // nieuwe vragen speelbaar, juist antwoord wordt goed gerekend, bronregel zichtbaar
  const play = await p.evaluate(ids => {
    const out = [];
    for (const id of ids.slice(0, 40)) {
      const q = QBY[id]; startSession({ title: 'finale-test', qs: [q] });
      const btns = [...document.querySelectorAll('.qcard .opt')];
      const right = btns.find(bn => (bn.textContent || '').includes(strip(q.o[q.a]).slice(0, 12)));
      if (!right) { out.push(id + ' geen knop'); continue; }
      right.click();
      const fb = document.querySelector('.qcard') ? document.querySelector('.qcard').innerText : document.body.innerText;
      out.push([id, /Bron:|ONBEVESTIGD/.test(fb)]);
    }
    Z = null; return out;
  }, newIds);
  ok('nieuwe vragen spelen: elke vraag toont de bron of de ONBEVESTIGD-melding na antwoorden', play.length === newIds.length && play.every(x => Array.isArray(x) && x[1]), play.filter(x => !Array.isArray(x) || !x[1]).map(x => Array.isArray(x) ? x[0] : x).join(','));

  // theorie-hoofdstukken met nieuwe delen
  const chap = async (id) => p.evaluate(id => { go('theorie', id); return document.querySelector('#view').innerText; }, id);
  const tS = await chap('sluizen'), tR = await chap('reglementen'), tN = await chap('navigatie');
  ok('hoofdstuk Bruggen & sluizen toont het ARS-deel en de bron', /Algemeen Reglement der Scheepvaartwegen \(1935\)/.test(tS) && /89,70 m lang/.test(tS) && /Artikel 6\.28 APSB kon niet/.test(tS));
  ok('hoofdstuk Reglementen toont het Maas-deel', /Gemeenschappelijke Maas/.test(tR) && /16 km\/u/.test(tR));
  ok('hoofdstuk Navigatie toont Dieptemeter en log met uitgewerkt voorbeeld', /Dieptemeter en log/.test(tN) && /1,80 m onder de kiel/.test(tN));
  const tW = await chap('wetgeving');
  ok('hoofdstuk Wetgeving: bronnenzin over niet-gelezen hoofdstukken en ONBEVESTIGD bij leeftijd 15', /Hoofdstukken 4, 6, 7 en 12 van het APSB zijn niet rechtstreeks/.test(tW) && /vanaf 15\s*ONBEVESTIGD/.test(tW));

  // zoeken
  const found = await p.evaluate(() => { SQ = ''; buildIndex(); const f = t => SIDX.filter(x => { const w = norm(t).split(' ').filter(Boolean); return w.every(k => x.x.includes(k)); }).length; return { maas: f('Gemeenschappelijke Maas'), ars: f('Algemeen Reglement'), log: f('dieptemeter'), bs: f('Brussel-Schelde') }; });
  ok('zoeken vindt Maas, ARS, dieptemeter en Brussel-Schelde', found.maas >= 5 && found.ars >= 3 && found.log >= 3 && found.bs >= 3, JSON.stringify(found));

  // Kwaliteitscontrole: paneel, filters, tellers
  await p.evaluate(() => go('audit')); await p.waitForTimeout(300);
  const panel = await p.evaluate(() => { const t = document.querySelector('#view').innerText; return { head: /finale dubbele controle/i.test(t), tiles: [...document.querySelectorAll('#view .stat b')].map(x => x.textContent).slice(0, 4), regRows: document.querySelectorAll('#finrt tr[data-r]').length, logRows: document.querySelectorAll('#fint tr[data-r]').length }; });
  ok('Kwaliteitscontrole: finale paneel met tellers', panel.head && panel.tiles.join(',').includes(String(F.counts.edits)) && panel.regRows === F.register.length && panel.logRows === F.log.length, JSON.stringify(panel));
  const filt = await p.evaluate(async () => {
    const vis = sel => [...document.querySelectorAll(sel)].filter(r => !r.hidden).length;
    const inp = document.getElementById('finr'), st = document.getElementById('fins');
    inp.value = 'Maas'; inp.dispatchEvent(new Event('input')); const maas = vis('#finrt tr[data-r]');
    inp.value = ''; inp.dispatchEvent(new Event('input'));
    st.value = 'ONBEVESTIGD'; st.dispatchEvent(new Event('change')); const onb = vis('#finrt tr[data-r]'); const onbBad = [...document.querySelectorAll('#finrt tr[data-r]')].filter(r => !r.hidden && r.dataset.st !== 'ONBEVESTIGD').length;
    st.value = ''; st.dispatchEvent(new Event('change')); const all = vis('#finrt tr[data-r]');
    const lq = document.getElementById('finq'); lq.value = 'q988'; lq.dispatchEvent(new Event('input')); const lg = vis('#fint tr[data-r]');
    return { maas, onb, onbBad, all, lg };
  });
  ok('register filtert op tekst en op status; log filtert op vraagnummer', filt.maas >= 3 && filt.maas < filt.all && filt.onb >= 3 && filt.onbBad === 0 && filt.lg >= 1 && filt.lg < 10, JSON.stringify(filt));
  const opens = await p.evaluate(() => document.body.innerText);
  ok('open punten zichtbaar: captcha, COLREG 28–37, art. 3.17–3.38', /captcha/.test(opens) && /COLREG regels 28–37/.test(opens) && /3\.17–3\.38/.test(opens));

  // flashcard-voortgang blijft werken met de uitgebreide set (indices bestaand ongewijzigd)
  const fc = await p.evaluate(n => { go('flashcards'); return document.querySelector('#view').innerText.includes(String(n)); }, Dn.FC.length);
  ok('flashcards-weergave toont het nieuwe totaal (' + Dn.FC.length + ')', fc);

  // mobiel
  const m = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  await m.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const mp = await m.newPage(); await mp.goto('file://' + NEW); await mp.waitForTimeout(400);
  const wide = [];
  for (const [v, a] of [['dashboard', ''], ['audit', ''], ['theorie', 'sluizen'], ['theorie', 'reglementen'], ['theorie', 'navigatie'], ['theorie', 'wetgeving'], ['situaties', ''], ['spiek', ''], ['tabellen', '']]) {
    await mp.evaluate(([v, a]) => go(v, a), [v, a]); await mp.waitForTimeout(200);
    const sw = await mp.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (sw[0] > sw[1] + 1) wide.push(v + '.' + a + ':' + sw.join('/'));
  }
  ok('mobiel 390 px: geen horizontale scroll in dashboard, audit, nieuwe theoriedelen, situaties, spiek, tabellen', wide.length === 0, wide.join(' '));
  await mp.screenshot({ path: (process.env.OUT || '.') + '/finale_mobiel_audit.png' });
  ok('geen JavaScript-fouten', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();

  const pass = results.filter(r => r.pass).length;
  fs.writeFileSync((process.env.OUT || '.') + '/testresultaten-finale.json', JSON.stringify({ datum: '2026-10-26', bestand: NEW, vergeleken_met: OLD, geslaagd: pass, totaal: results.length, tests: results }, null, 1));
  console.log('\n' + pass + '/' + results.length + ' geslaagd');
  process.exit(pass === results.length ? 0 : 1);
})();
