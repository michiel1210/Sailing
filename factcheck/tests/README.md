# Tests

Drie onafhankelijke testscripts (Node + Playwright, headless Chromium). Ze lezen `index.html` en schrijven hun uitvoer naar de map in `OUT` (standaard de huidige map).

```bash
cd factcheck/tests
export OUT=/tmp/uitvoer && mkdir -p $OUT
git show 0e219d7:index.html > $OUT/oud.html          # versie vóór de finale controle
node test_finale.js ../../index.html $OUT/oud.html   # 55 tests: finale controle, vergeleken met de oude versie
node test_app.js ../../index.html                    # 103 tests: functionaliteit en fase 1B
node test_links.js $(pwd)/../../index.html           # elke interne link en knop (48 unieke links)
```

Op 26-10-2026 slaagden alle tests op de `index.html` in deze map. Geteste omgeving: alleen Chromium; niet op echte telefoons of in Firefox/Safari.
