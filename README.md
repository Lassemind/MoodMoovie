# Film Mood Matcher

Eine App, die anhand deiner aktuellen Stimmung passende Filme vorschlägt. Gib eine Emotion ein – die App analysiert sie mithilfe von GPT und findet den optimalen Film über die TMDb API.

## Features

- Stimmungsbasierte Filmempfehlungen
- Verschiedene Erlebnis-Typen zur Auswahl
- Detaillierte Film-Informationen und Erklärungen
- Historie der vorherigen Empfehlungen
- Moderne und benutzerfreundliche Oberfläche

## Voraussetzungen

- Node.js (v14 oder höher)
- npm oder yarn
- TMDb API Key
- OpenAI API Key

## Installation

1. Klone das Repository:
```bash
git clone https://github.com/lassemind/MoodMovie
cd fMoodMoovie
```

2. Installiere die Abhängigkeiten:
```bash
npm install
```

3. Erstelle eine `.env` Datei basierend auf `.env.example`:
```bash
cp .env.example .env
```

4. Füge deine API Keys in die `.env` Datei ein:
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Entwicklung

Starte den Entwicklungsserver:
```bash
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

## Produktion

Erstelle einen Produktionsbuild:
```bash
npm run build
```

Der Build wird im `dist` Verzeichnis erstellt.

## Lizenz

MIT 