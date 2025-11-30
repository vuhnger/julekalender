# Julekalender 2025 (React + Vite)

Digital adventskalender bygget med React/Vite for statisk deploy (GitHub Pages).

## Kjøre lokalt
```bash
npm install
npm run dev
```

## Bygg og deploy
```bash
npm run build   # kjører lint + vite build
npm run deploy  # pusher dist/ til gh-pages (static)
```

## Innhold
- `src/content.json`: luker 1–24. Hver post har minimum `type` og valgfritt `title` + data. Komponentene har egne fallbacks, så manglende felter krasjer ikke.
- `src/content.example.json`: viser eksempler på alle støttede typer.

Støttede `type`-verdier:
- `text` (body)
- `code` (starter)
- `wordle` (seed)
- `sudoku` (puzzle)
- `video` (url)
- `redirect` (url)
- `recipe` (ingredients, steps, body)
- `spot-diff` (differences)
- `gift-wrap` (options, correct, body)
- `rhyme` (body, word)
- `quiz` (questions: [{question, options, correct}])

## Komponenter
- `ContentRenderer` er en tynn dispatcher som velger riktig komponent basert på `type`.
- Fallback-tekster/regler ligger i komponentene og i `content/utils`.

## Lint
```bash
npm run lint
```
Kjøres automatisk som del av `npm run build`.
