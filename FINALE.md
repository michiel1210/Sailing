# Finale dubbele controle van het vaarbewijs-leerplatform

Repository: `collection-of-all` (bestaande master `index.html`; geen nieuwe repository, niets vanaf nul opgebouwd).
Controle: 26 oktober 2026, uitgevoerd op de versie na fase 1B (commit `0e219d7`, 1587 vragen).
Resultaat: dezelfde `index.html`, nu met 1610 vragen, 536 flashcards, 295 bibliotheekitems, 30 situaties, 513 tekeningen en een eigen paneel **Kwaliteitscontrole → Finale dubbele controle**.

Alles wat hieronder staat is werkelijk gedaan en getest. Wat niet kon, staat bij "Open punten". Deze controle is geen volledige juridische controle: de Belgische bron (het APSB) was maar voor een klein deel leesbaar (zie 2).

## Kort

| | Aantal |
|---|---|
| Bestaande vragen verbeterd of ONBEVESTIGD gemarkeerd | 44 |
| Nieuwe vragen | 23 (19 bevestigd, 4 ONBEVESTIGD: Kanaal Brussel-Schelde) |
| Nieuwe flashcards | 8 (1 ONBEVESTIGD) |
| Nieuwe theoriedelen | 3 (ARS 1935; Maas en Brussel-Schelde; dieptemeter en log) |
| Andere tekstcorrecties (theorie, flashcards, situaties, startpagina) | 28 (plus 1 bijgewerkte registerregel) |
| Regels in het bronnenregister (nieuw) | 72 |
| Open punten voor een menselijke controle | 13 |
| Vragen die ONBEVESTIGD zijn en niet in examens voorkomen | 27 van 1610 |
| Gewiste inhoud | 0 |
| Technische tests | 55 + 103 + 48 links, alles geslaagd |

Het volledige logboek (107 regels) staat in `factcheck/foutenlog-finale.csv`, het bronnenregister (72 regels) in `factcheck/bronnenregister.csv`. Beide zijn ook in de app te bekijken en te filteren.

## 1. Wat werkelijk is nagekeken

| Onderdeel | Hoe |
|---|---|
| 17 theoriehoofdstukken (92 koppen) | volledig gelezen, tabel voor tabel |
| 1587 bestaande vragen | opnieuw één voor één gelezen: vraag, juiste antwoord, afleiders, uitleg, categorie, binnenwater of zee, niveau; alle rekenvragen opnieuw uitgerekend (sluizen, bruggen, brandstof, afstand en snelheid) en juist bevonden |
| 536 flashcards, 295 bibliotheekitems, 30 situaties | volledig gelezen; de reken- en routestappen van situaties S0–S17 opnieuw uitgerekend (kaartpunten, TAW, afstanden): juist |
| 9 app-pagina's (dashboard, introductie, studieplanner, tabellen, spiekbriefje, beperkt, algemeen, situaties, aanpak) | als tekst uitgelezen en gelezen |
| Tekeningen (513) en vraagafbeeldingen | inhoudelijk bekeken in de factcheck en fase 1B (zie `FACTCHECK.md` en `FASE1B.md`); in deze ronde niet opnieuw allemaal bekeken. Technisch getest: elke verwijzing naar een tekening bestaat en alle afbeeldingen als antwoordoptie zijn zichtbaar |
| Zichtbare controle | schermafbeeldingen werkelijk bekeken van het Kwaliteitscontrole-paneel, het bronnenregister met filter, de nieuwe ARS-sectie, de schutstappen met ONBEVESTIGD-label en een nieuwe vraag met uitleg, op 1280 px, 390 px en in donkere modus. Geen horizontale overflow op de zes gecontroleerde pagina's |

Niet gedaan: een test op echte telefoons of in Firefox/Safari. Alle tests draaiden in een headless Chromium.

## 2. Wat de bronnen toelieten (belangrijk)

- Het Belgische **APSB** (Algemeen Politiereglement voor de Scheepvaart op de Binnenwateren) was online alleen leesbaar tot en met art. 3.16 (visuris, Nederlandse tekst). Hoofdstukken 4 (geluid, marifoon), 6 (vaarregels, sluizen, waterskiën), 7 (ligplaats) en 12 (varen onder invloed) en art. 3.17–3.38 konden **niet** uit de Belgische tekst gelezen worden. Ze zijn getoetst aan de examenleerstof, het Nederlandse BPR en consistentie, en dat staat zo in het register.
- **Aanhangsel 7** (verkeerstekens) is gelezen in een kopie uit 2014.
- De **FOD Mobiliteit**-pagina's en -pdf's zaten tijdens de finale controle achter een captcha (ook bij een tweede poging).
- De shell had geen internet; alleen WebFetch en WebSearch. WebFetch geeft samenvattingen van een klein model en bleek soms inconsistent: belangrijke cijfers zijn daarom met een eis tot letterlijk citaat opgehaald en waar twee lezingen verschilden, is de bewering ONBEVESTIGD gebleven (Brussel-Schelde).
- In een opgehaalde etaamb-pagina stond een opmerking die als instructie voor een AI geformuleerd was. Die is genegeerd en heeft niets aan de inhoud veranderd.
- Zes repositories (`Last`, `oefenexamen`, `zeil-tekening`, `end1`, `end2`, `md102-end2`) waren niet bereikbaar en zijn dus niet gecontroleerd. De 143 tekstvragen van RuimBaan/StuurbrevetSimulator zijn niet met de vragenbank vergeleken.
- Er is **niet** gepusht: GitHub is niet gekoppeld aan deze sessie (push gaf 403). De wijzigingen staan lokaal op branch `factcheck-2026-10` en in de ZIP.

## 3. Fouten gevonden en verbeterd

Elke wijziging staat met oorspronkelijke tekst, fout, correctie en bron in `factcheck/foutenlog-finale.csv`.

**Inhoudelijke fouten**
- **IALA-A/IALA-B (q1098, q1095, theorie)**: de uitleg zei dat in regio B rood stomp en groen spits blijft, en dat "de koppeling nergens ter wereld verandert". Fout: in IALA-B zijn de kleuren omgekeerd en blijven de vormen bij hun kant (stomp = bakboord, spits = stuurboord; rood is daar stuurboord).
- **Zeilplank (q41, q1423, theorie)**: "zeilplank = klein zeilschip" staat niet in art. 1.01 APSB; q1423 sprak over een bord "verboden voor zeilplanken" dat niet bestaat (A.17 is het einde van een zone). Vraag herschreven, ONBEVESTIGD.
- **Marifoon (q447)**: "een klein schip hoeft geen marifoon" was algemeen onjuist (motorvaartuigen van meer dan 7 m moeten er een hebben). Antwoord herschreven.
- **Tweede toplicht (q945)**: "boven 50 m twee toplichten" is de zeeregel (COLREG 23); op de binnenwateren is het tweede toplicht facultatief en pas verplicht vanaf 110 m (art. 3.08 lid 2).
- **Eén wit rondom licht (q998)**: lijst onvolledig, ook een klein zeilschip < 7 m (art. 3.13 lid 5).
- **"Tijdig tonen" (q1377, flashcard 131, theorie)**: stond als alleen een zeeregel; art. 3.13 lid 6 APSB kent het ook voor een schip zonder mast.
- **Groen boven wit (q988)**: de optie "Vissersschip" was niet ondubbelzinnig fout; vervangen.
- **Veiligheidsmarge brug (q373–q376, theorie)**: "0,30/0,40/0,50 m" was een voorbeeldwaarde zonder bron; het ARS schrijft 0,30 m voor.
- **Voorrang (q1384)**: uitleg "klein wijkt voor groot gaat boven alle regels" botste met de voorrangsladder.
- **Weer (q10052)**: de uitleg beschreef advectiemist bij de vraag over stralingsmist.
- **Manoeuvre (q595)**: een optie botste met q1124 en q76010 (voorspring).
- **Bord- en beeldvragen (q647, q733, q783, q1054)**: vraagtekst onduidelijk of beschrijving klopte niet met de afbeelding of de officiële omschrijving.
- **COLREG-theorie**: regel 18 zette het door diepgang beperkte schip in de rangorde bij het beperkt manoeuvreerbare schip (regel 18 d heeft een aparte, zwakkere regel); regel 35 c noemde het door diepgang beperkte en het duwende schip niet.
- **Noodseinen (theorie)**: "met een witte lamp knipperen is geen noodsein" is zonder nuance fout, want SOS in morse met licht is er wel een.
- **Brussel-Schelde (theorie)**: dat reglement is een Besluit van de Vlaamse Regering, geen ministerieel besluit; de bewering "meldingsplicht (art. 3 §1)" was niet te bevestigen en is geschrapt/ONBEVESTIGD.

**Beweringen zonder bron, nu juist gelabeld (niets verwijderd)**
- Vuistregels als vuistregel gelabeld: minstens een derde brandstofreserve (q423–q425, theorie), ankerlijn 3 à 5 × de diepte.
- Zonder bron nu ONBEVESTIGD of met voorbehoud: art. 3.20-hoogtes (q999, q1013), "inschrijven vanaf 15 jaar" (q919, flashcard 218, theorie), verzekering als vaste plicht (flashcard 221; de theorie zegt "sterk aangeraden"), zwemverbod (theorie, nu "in de regel", met bord E.105 als uitzondering), het artikelnummer 12.01 bij varen onder invloed, art. 6.28-stappen bij het schutten, groot-voor-klein in situatie 27.
- Marifoon: "zendvergunning" is geen officiële term (stationsvergunning, q1285/q1286); ATIS en DSC (q86, q112, q1290) met bron en datum; ">7 m" bevestigd.
- Drie ONBEVESTIGDE vragen (q550, q1035, q1061) hadden als reden alleen "Zie q…"; elk heeft nu een eigen volledige reden.

**Onjuiste of te sterke beweringen van het platform zelf**
- Het dashboard sprak van "gecontroleerde examenvragen" terwijl een deel ONBEVESTIGD is. Het toont nu het echte aantal en het aantal onbevestigde vragen.
- De startpagina en introductie suggereerden dat alles aan de regelgeving getoetst was; ze noemen nu de grenzen van de controle.

## 4. Toegevoegd en waarom

De examenleerstof van de FOD noemt vier onderwerpen waarover de master geen enkele vraag of theorie had:

| Onderwerp | Toegevoegd | Bron |
|---|---|---|
| Algemeen Reglement der Scheepvaartwegen 1935: afmetingen van een sluis (0,30 m korter, 0,20 m smaller, tolerantie 0,10 m bij ≤ 5,20 m), hoogte onder bruggen (0,30 m), zeilen strijken op 200 m, beweegbare bruggen | theoriedeel in Bruggen & sluizen, 6 vragen (q80001–q80006), 3 flashcards | ARS art. 1, 29, 32 (itb-info, tot 09-03-2007; art. 1 ook kustcodex) |
| Gemeenschappelijke Maas: 16 km/u, 9 km/u op de rechterhelft km 6,790–8,860, snelle vakken, waterskiën, zeilplank | theoriedeel in Reglementen, 9 vragen (q80011–q80019), 3 flashcards | Maasreglement art. 6.33a, 6.33b en 6.33c (letterlijk gelezen in een kopie zonder versiedatum) |
| Kanaal Brussel-Schelde | 4 vragen (q80021–q80024), 1 flashcard, alle ONBEVESTIGD (niet in examens) | alleen de oorspronkelijke tekst van 2006 (etaamb); latere wijzigingen of vervanging door het Scheepvaartdecreet 2022 niet nagekeken |
| Dieptemeter en log, plus rekenvoorbeelden | theoriedeel in Navigatie, 4 vragen (q80031–q80034), 1 flashcard | examenleerstof en eigen berekening (VEREENVOUDIGD in het register) |

Daarnaast: BIPT-handleiding 2025 verwerkt (certificaat 5 jaar geldig, dualwatch verboden, zendvermogen ≤ 1 W op schip-schipkanalen, ATIS verplicht en DSC verboden op de binnenwateren). Voor het beperkt certificaat is dit de meest recente bron die ik kon lezen.

Alle nieuwe vragen dragen een bron en het label "finale controle". De bevestigde komen in examens voor, de ONBEVESTIGDE niet.

## 5. Bronnenregister (72 regels)

Per belangrijke regel: groep, regel, bron, artikel of verwijzing, status, opmerking. Gebruikte statussen:

| Status | Aantal | Betekenis |
|---|---|---|
| BEVESTIGD | 28 | bronnentekst werkelijk gelezen |
| BEVESTIGD · SECUNDAIRE BRON | 9 | bevestigd, maar niet in de Belgische brontekst zelf |
| BEVESTIGD · KOPIE ZONDER VERSIE | 3 | letterlijk gelezen, kopie vermeldt versie of datum niet |
| BEVESTIGD · 1 BRON | 2 | slechts één bron |
| VEREENVOUDIGD | 6 | didactische samenvatting |
| VUISTREGEL | 1 | geen reglementaire waarde |
| NIET BRONGECONTROLEERD | 8 | algemene kennis, niet teruggelezen |
| ONBEVESTIGD | 15 | niet te bevestigen; telt niet mee in examens |

Geraadpleegde bronnen in deze ronde (volledige lijst met URL in de app en in `FACTCHECK.md`): APSB-visuris (art. 1.01, 2.02, 3.08–3.16), ARS 1935 (itb-info, kustcodex), Maasreglement (itb-info), BVR 18/11/2005 (etaamb), IALA Maritime Buoyage System (secundair), BIPT Handleiding VHF 2025 en de BIPT-folder "De marifoon", COLREG regel 35 (Cult of Sea, secundair), FOD Vademecum pleziervaart 2014 en BIPT-handleiding 2004 (eerder). Geen enkele bron is verzonnen; waar een bron ontbreekt, staat TE VERIFIËREN of ONBEVESTIGD.

## 6. Onafhankelijke eindcontrole

Na het bouwen is de eindversie los van het bouwscript getest door de uitvoer zelf te lezen en te bedienen:
- **55 nieuwe tests** (`factcheck/testresultaten-finale.json`): elke gewijzigde vraag staat in het logboek; er zijn geen vragen verdwenen; nieuwe vragen hebben bron en geldige opties; de rekenantwoorden kloppen (sluis 90 × 12 → 89,70 × 11,80; 4,50 − 4,25 = 0,25 < 0,30 → nee); ONBEVESTIGDE vragen komen niet voor in tientallen gesimuleerde examens; nieuwe bevestigde vragen wel; theorie toont de nieuwe delen en de waarschuwingen; zoeken vindt ze; het paneel filtert op tekst en status; geen JavaScript-fouten; geen horizontale overflow op 390 px.
- **103 bestaande tests** (fase 1B): alles blijft geslaagd, dus er is niets stukgegaan.
- **48 links** (`test_links.js`): alle werken, 0 fout.
- De drie testscripts staan in `factcheck/tests/` (met uitleg om ze zelf te draaien) en zijn op de definitieve `index.html` in deze repo gedraaid, niet alleen op de bouwuitvoer.
- De test vond zelf nog drie echte tekortkomingen (de drie "Zie q…"-redenen) en drie fouten in de test; alles hersteld en opnieuw gedraaid: 55/55.

## 7. Open punten (TE VERIFIËREN) — hier is menselijke controle nodig

Ook zichtbaar in de app (Kwaliteitscontrole → Open punten).

1. **APSB hoofdstukken 4, 6, 7, 12 en art. 3.17–3.38, 6.20, 6.28, 6.35, 7.07**: niet uit de Belgische tekst gelezen. Het gaat om geluidsseinen, voorrang en vaarregels, sluizen (stappen, 10 m afstand tot een schip met een blauwe kegel), ligplaats en varen onder invloed.
2. **Art. 3.20** (ankerlichten, gemeerde schepen): tekst niet leesbaar; q1013 ONBEVESTIGD.
3. **COLREG regels 28–34 en 36–37**: niet teruggelezen; regel 35 alleen in een secundaire bron.
4. **Gemeenschappelijke Maas**: de gelezen kopie heeft geen versie of datum; de verkeerstekens en markering van de Maas zijn niet ingezien.
5. **Kanaal Brussel-Schelde**: alleen de tekst van 2006; q80021–q80024 blijven ONBEVESTIGD.
6. **ARS art. 29 en 32**: maar in één geconsolideerde kopie (tot 09-03-2007) gelezen.
7. **FOD-examenpagina** (captcha): "inschrijven vanaf 15 jaar", het zwemverbod en de verzekering zijn niet bevestigd; vergelijk ook met de slaag- en verdelingsregels.
8. **Uitrustingslijsten pleziervaart** (MB 12/11/2020, KB 28/06/2019): bijlagen niet leesbaar; reddingsmiddelen en marifoonplicht steunen op oudere bronnen (q831, q938, q114).
9. **Pictogrammen aanhangsel 7**: betekenis bevestigd, maar de tekening van elk bord is niet met de officiële afbeelding vergeleken.
10. **EHBO (verdrinking, verslikking)**: standaardrichtlijnen, niet teruggelezen (q119, q163).
11. **Zes onbereikbare repositories en RuimBaan/StuurbrevetSimulator**: niet gecontroleerd; werkwijze voor nieuwe uploads in `factcheck/werkwijze-nieuwe-uploads.md`.
12. **Twee inhoudelijke duplicaten** (q87/q1285, q88/q1286) zijn bewust behouden; ze dekken hetzelfde onderwerp met andere formulering.
13. **27 vragen ONBEVESTIGD**: ze tellen niet mee in examens en gewone oefenpools. Oefenexamenreeksen 2 en 3 bevatten er één, daardoor tellen die 29 vragen in plaats van 30.

## 8. Correcties op eerdere rapporten

In `FACTCHECK.md` stonden twee onjuiste regels. Ze zijn daar met een verwijzing hierheen gecorrigeerd (niets is stilzwijgend gewist):
- *"'tijdig tonen' is de regel op zee"*: onjuist. Art. 3.13 lid 6 APSB laat een tijdig getoonde lantaarn zelf toe voor een klein schip zonder mast.
- *"volgorde van invaren volgens art. 6.28"*: niet nagekeken. Art. 6.28 kon niet gelezen worden; het artikelnummer en de stappen zijn ONBEVESTIGD (het onderwerp zelf komt uit de examenleerstof en het Nederlandse BPR).

## 9. Aanbevolen verbeteringen

1. Geef toegang tot (of upload) de actuele geconsolideerde tekst van het APSB, het ARS en het Maasreglement; dan kunnen 13 open punten en alle 15 ONBEVESTIGDE registerregels in één ronde afgesloten worden.
2. Open de FOD-pagina "Beperkt en algemeen stuurbrevet" zelf in een browser (captcha) en bevestig of schrap leeftijd 15, zwemverbod en verzekering.
3. Upload de zes onbereikbare repositories en de 143 tekstvragen van RuimBaan/StuurbrevetSimulator: dan kan ik ze met dezelfde werkwijze verwerken.
4. Leg een officiële COLREG-tekst (IMO of Belgische vertaling) naast regels 28–37.
5. Koppel GitHub aan de sessie zodat de branch `factcheck-2026-10` gepusht en als pull request voorgelegd kan worden. Tot dan: gebruik de ZIP.
6. Laat iemand die het examen kent de 27 ONBEVESTIGDE vragen doorlopen; bevestigde vragen worden dan met één vlag vrijgegeven.

## 10. Terugdraaien en herbouwen

- Alle wijzigingen zitten in drie commits op branch `factcheck-2026-10`; `main` (`847fbf7`) is onaangeroerd. Terugdraaien kan met `git checkout main` of `git revert`.
- Het logboek bevat oorspronkelijke en nieuwe tekst per wijziging, dus elke wijziging is ook handmatig terug te draaien.
- Niets is verwijderd: wat niet te bevestigen was, is gemarkeerd en uit de examens gehouden.
