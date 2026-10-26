# Fase 1B — afbeeldingen uit de repositories

Uitgevoerd op 26 oktober 2026, bovenop de factcheck van 25–26 oktober (`FACTCHECK.md`). Zelfde master (`index.html`), geen nieuwe repository.

## Wat er te vinden was

- **Bereikbaar:** 30 repositories (de 30 uit je overzicht, inclusief `collection-of-all`). Elke repository bevat één HTML-bestand.
- **Foto's, screenshots, scans, pdf's:** **geen**. Ook niet in de geschiedenis van de repositories (elke repository nagekeken op alle ooit toegevoegde bestanden). Alle beelden zijn **tekeningen (SVG)** die in de pagina staan of door het script getekend worden.
- **Niet bereikbaar, dus niet bekeken:** `Last`, `oefenexamen`, `zeil-tekening`, `end1`, `end2`, `md102-end2`. Hun inhoud zat al in de master (fase 0), maar de originele bestanden en eventuele afbeeldingen heb ik niet kunnen zien.

## Hoe

1. Elke pagina is automatisch doorgeklikt (knoppen, tabbladen, keuzelijsten, animaties); elke tekening die verscheen, is opgeslagen: **4526** keer, inclusief animatieframes.
2. Elke tekening is weergegeven met de CSS van haar eigen pagina en op beeld ontdubbeld: **504 unieke tekeningen** (+ 4 lege).
3. **305** waren pixelgelijk aan een tekening die al in de master stond (steekproef nagekeken; al gecontroleerd in de factcheck). De **199 andere** zijn één voor één bekeken, samen met hun bijschrift, en vergeleken met de leerstof.
4. Nieuwe informatie is nagekeken tegen de bronnen van de factcheck en de nieuwe bronnen S20–S27 (zie onder). Wat niet bevestigd kon worden, staat erin als **ONBEVESTIGD**.
5. Wat overgenomen werd, is als zelfstandige tekening in de master gezet (stijlen ingebakken, ontbrekende verlopen en patronen meegenomen) en opnieuw gerenderd om te controleren dat ze er hetzelfde uitziet.

De volledige inventaris (bron, bestand, hoe gevonden, aantal frames, onderwerp, informatie, hoofdstuk, controle, onduidelijkheden, verwerking) staat in **`factcheck/afbeeldingen-inventaris.csv`**. De log van elke toevoeging en correctie staat in **`factcheck/foutenlog-fase1b.csv`** en in de app onder **Kwaliteitscontrole → Fase 1B**.

| Verwerking van de 508 unieke tekeningen | Aantal |
|---|---|
| Al in de master (identiek, andere tekening van hetzelfde, of als simulatie) | 353 |
| Dubbel van Reven (`Reven-` is bit voor bit gelijk aan `Reven`) | 65 |
| Verwerkt in de master | 53 (+ 1 dubbel waarvan de inhoud verwerkt is) |
| Geen leerinhoud (logo's, knoppen, lege frames) | 19 |
| Niet verwerkt, met reden | 17 (zie onder) |

## Wat er in de master bijkwam

| Hoofdstuk / onderdeel | Toegevoegd |
|---|---|
| **Voorrangsregels** | 28 vragen met situatietekening (17 uit `officeel-examen`, 11 uit `voorrang`), 2 tekstvragen, nieuw deel **Voorrang in beeld** met 9 tekeningen (4 gecorrigeerd) |
| **Verkeerstekens** | vragen over E.4 a), E.4 b) en A.5.1; uitleg over de varianten E.5.1–E.5.15 |
| **Praktijk & manoeuvres** | 3 nieuwe delen (**Zeilen: onderdelen, koersen en manoeuvres**, **Reven**, **Wal, lijnen en knopen**), 19 tekeningen in **Praktijk in beeld**, 14 praktijkvragen in een nieuwe categorie *Zeilen & praktijk* die **niet** meetelt in de examensimulaties |
| **Aanvulling algemeen (zee)** | 8 COLREG-vragen (toepassing, hydrografisch werk, onderwaterwerk, regel 15, regel 23, regel 26, vlag L, verkeersscheidingsstelsel) |
| **Weer, motoren, veiligheid, EHBO, sluizen, geluid, getijden, begrippen** | 10 vragen (warmtefront, windkracht 6, blauwe rook, vastlopen, kleur reddingsmiddelen, afgerukt vingerkootje, afschutten, mistsein gesleept schip, getijperiode, drijvend werktuig) |
| **Oefenexamens** | **G · Examenreeksen**: de vier reeksen uit `officeel-examen` (naar de FOD-examens van 2012–2014), elk als beperkt (20) of volledig (30), met examenregels. Bestond een vraag al in de master, dan staat de gecontroleerde mastervraag in de reeks; anders de nieuwe vraag. |
| **Kwaliteitscontrole** | rapport fase 1B met log, foutenlijst en wat bewust niet werd overgenomen |

In totaal **65 nieuwe vragen** (1522 → 1587), **58 nieuwe tekeningen** (455 → 513), **28 nieuwe bibliotheekitems** (267 → 295). Twee nieuwe vragen zijn **ONBEVESTIGD** (q70225 engte met stroom, q70322 kleur van verkeersscheidingsstelsels) en tellen niet mee in examens.

## Fouten gevonden

| Waar | Fout | Gevolg |
|---|---|---|
| `last1` · voorrang langs de stuurboordwal | schepen aan de verkeerde oever: de tekening toonde stuurboord aan stuurboord | gecorrigeerd overgenomen |
| `last1` · blauw bord | schepen passeerden bakboord aan bakboord; bord op de oever i.p.v. op het schip | gecorrigeerd overgenomen |
| `last1` · recht op elkaar af | uitwijkkoers van 'Jij' liep naar de koerslijn van de ander | gecorrigeerd overgenomen |
| `spoedcursus` · zeilschepen, wind van verschillende kant | beide zeilen aan de windkant | gecorrigeerd overgenomen |
| `RuimBaan` · 8 voorrangsscènes | windpijl omgekeerd, zeil altijd aan stuurboord, scène 4 te scherp aan de wind (28°) | niet overgenomen (regels staan al in de master) |
| `voorrang` · Zeil · Oplopen | beide zeilboten varen recht in de wind | niet overgenomen |
| `officeel-examen` · R2-21 | tekst spreekt van 'links nacht, rechts dag', de tekening toont alleen het dagmerk | in de reeks vervangen door q804 |
| `officeel-examen` · R3-7 (B.6) | 'gemeten ten opzichte van de oever' staat niet in aanhangsel 7 APSB | in de reeks vervangen door q259 |
| `officeel-examen` · R2-14, R3-11, R3-30 | 'kegel' i.p.v. walbaken; visser met groen boven wit op binnenwater; definitie 'rijzing' | in de reeks vervangen door gecontroleerde mastervragen |
| `zeilpraktijktest` · vertrek aan lagerwal | 'achterspring vast … vooruit … boeg vrij … achteruit weg' is tegenstrijdig | niet overgenomen; de master volgt de juiste methode (voorspring) |
| `zeilen6` · overstag gaan | 'helmstok naar loef' is fout: bij 'Ree!' gaat de helmstok naar lij | niet overgenomen |
| `vaartbewijs-borden` · stuwlichten | Nederlands BPR, niet bevestigd voor België | niet overgenomen (zoals in fase 0) |
| **master** · L201 baggerschip | uitleg zei 'vooraanzicht', de tekening is een achteraanzicht | uitleg aangepast |
| **master** · 7 dagmerken 'Nachtbeeld naast dagbeeld' | de tekeningen tonen alleen het dagmerk | categorienaam aangepast |

## Bewust niet (of nog niet) verwerkt

- `RuimBaan` en `-StuurbrevetSimulator`: dezelfde bank van 143 **tekstvragen**. Geen afbeeldingen, dus buiten deze fase; nog niet vraag per vraag met de master vergeleken.
- `vaart` (Peil & Pand): rekentrainer met **echte kanaalpeilen** (Albertkanaal, Kempense kanalen). De peilen zijn niet tegen een bron van De Vlaamse Waterweg gecontroleerd; de rekenmethode staat al in de master.
- `kp-nap-beginners`, `doorvaart-oefening`: Nederlandse NAP/KP-context (de master werkt met TAW).
- `zeilmanuel` paalsteek: tekening te schematisch om de knoop te herkennen; alleen in tekst.
- `borden-en-bruglichten` E.5.4/E.5.8: betekenis bevestigd, pictogram niet tegen de officiële tekening gecontroleerd; alleen in tekst.
- `Wesley`: proefexamens Eventmanager, geen vaarbewijsinhoud.

## Bronnen (nieuw in fase 1B, geraadpleegd 26-10-2026)

- S20 `officeel-examen` (repo): reeksen "nagebouwd op de FOD-examens 2012–2014 die de Vlaamse Vaarschool publiceert" — secundaire bron, elke vraag apart nagekeken
- S21 COLREG regel 35 — https://www.law.cornell.edu/cfr/text/33/83.35
- S22 COLREG regel 23(b) — https://www.cultofsea.com/colregs/part-c-lights-and-shapes-rules-20-31/rule-23-power-driven-vessels-underway/
- S23 Internationaal Seinboek, eenletterseinen — https://navalmarinearchive.com/research/docs/single_letter_signals.html
- S24 Heaving to (bijliggen) — https://en.wikipedia.org/wiki/Heaving_to
- S25 USNA Navy 44 Sailing Guides: Reefing — https://www.usna.edu/Sailing/_files/documents/lectures/navy44/guides/reefing.htm
- S26 Hoe ga je overstag? — https://webwoordenboek.nl/kenniscentrum/hoe-ga-je-overstag
- S27 HealthLinkBC, afgerukt lichaamsdeel — https://www.healthlinkbc.ca/node/1037/
- S3 en S5 opnieuw geraadpleegd: art. 1.01 APSB (drijvend werktuig) en aanhangsel 7 (E.4, A.5.1, E.5–E.5.15, D.3, E.17–E.24, B.9, B.11)

Grenzen: de examenleerstof van de FOD toonde op 26-10-2026 een captcha; de zeilpraktijk is daarom **niet** tegen de officiële examenleerstof getoetst en staat als praktijkstof in de app.

## Tests

103 van 103 geslaagd (`factcheck/testresultaten.json`): de 88 tests van de factcheck en 15 nieuwe, o.a. alle nieuwe tekeningen zichtbaar in de vraag, praktijkvragen nooit in examensimulaties, examenreeksen in de juiste volgorde zonder onbevestigde vragen, nieuwe theoriedelen en bibliotheekgroepen, geen horizontale scroll op 390 px.

## Gewijzigde bestanden

- `index.html` — de master
- `FASE1B.md` — dit rapport
- `factcheck/afbeeldingen-inventaris.csv` — nieuw
- `factcheck/foutenlog-fase1b.csv` — nieuw
- `factcheck/werkwijze-nieuwe-uploads.md` — nieuw
- `factcheck/testresultaten.json` — bijgewerkt
