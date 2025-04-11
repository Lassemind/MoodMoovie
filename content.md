# Film Mood Matcher – App Development Plan

## 1. App-Idee

**Name**: Film Mood Matcher  
**Beschreibung**: Eine App, die anhand deiner aktuellen Stimmung passende Filme vorschlägt. Gib eine Emotion ein – die App analysiert sie mithilfe von GPT und findet den optimalen Film über die TMDb API. Inklusive Begründung, Poster und Watchlink.

---

## 2. App-Flow (Screens & Logic)

### Screen 1: Mood Input
- **Titel**: *Wie fühlst du dich gerade?*
- **Elemente**:
  - Textfeld für freie Eingabe (z. B. „Ich bin melancholisch“)
  - (Optional) Emoji-Auswahl
  - Button: *Film finden*

### Screen 1b: Erlebnis-Typ auswählen
- **Frage**: *Wie viel willst du dich auf den Film einlassen?*
- **Optionen**:
  - Nur was Leichtes nebenbei
  - Einen richtigen Filmabend
  - Etwas Künstlerisches
  - Überrasch mich

### Screen 2: Mood Analysis
- **Funktion**:
  - Zeigt Lade-Animation (z. B. Mood-Farbverlauf)
  - Übergibt Stimmung + Erlebnis an Backend (GPT + TMDb)
  - Empfängt Filmvorschlag + Erklärung

### Screen 3: Film Recommendation
- **Elemente**:
  - Film-Poster (via TMDb-URL)
  - Titel, Jahr, Genre, Beschreibung
  - GPT-Erklärung: *„Weil du dich melancholisch fühlst…“*
  - Buttons: *Trailer ansehen*, *Film speichern*

### Screen 4: Mood History (optional)
- Liste vorheriger Mood-Film-Kombis
- Filterbar nach Stimmung, Genre, Bewertung

---

## 3. Backend-Struktur

### Mood Mapping (GPT)
GPT-Request zur Analyse des Nutzereingabetexts:

```json
{
  "input": "Ich bin melancholisch und will nur was Leichtes nebenbei schauen.",
  "output": {
    "mood": "melancholisch",
    "energy": "leicht",
    "genres": ["Drama", "Comedy"],
    "keywords": ["Verlust", "Alltag", "ruhig"]
  }
}
```

### TMDb API-Aufruf
Nutze `discover/movie`-Endpoint:

```
https://api.themoviedb.org/3/discover/movie?with_genres=18&sort_by=vote_average.desc&language=de
```

Antwort enthält:
- Titel, Poster-URL, Beschreibung, Erscheinungsjahr, Genre

### GPT-Erklärung
Prompt:

> „Schreibe 2 Sätze, warum der Film [FILMTITEL] zu einer Person passt, die sich [STIMMUNG] fühlt und etwas [ENERGIELEVEL]-mäßiges sucht.“

---

## 4. API Keys & Tools

- [TMDb API Key](https://www.themoviedb.org/)
- [OpenAI API Key](https://platform.openai.com/)
- Backend: z. B. FastAPI, Supabase Edge Functions oder ein Curser Function-Script

---

## 5. Design & UX

- Farbgestaltung abhängig von Stimmung
- Smooth Animations (Mood-Morphing, Poster-Fade)
- Inspiration: Letterboxd, A24-Filmästhetik
- Fonts: Cinematisch, serifenbetont

---

## 6. Bonus-Ideen

- **Voice Input**: „Siri, ich fühl mich verloren…“
- **Spotify-Integration**: Stimmung aus Songs erkennen
- **„Mood Swipe“**: Tinder-artige UI für Filme
- **Social Sharing**: Mood + Film als Story teilen
- **Poster-Farbanalyse**: Emotion durch Farben verfeinern

---

## 7. Next Steps

- Screens in Curser definieren
- HTTP-Requests für GPT & TMDb implementieren
- Mood-to-Film-Mapping testen
- MVP bauen → iterativ verfeinern
"""
