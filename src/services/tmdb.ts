import axios from 'axios';

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGY2YzA4OTI3N2U0NDE2YTBiNDhmNjkwNDBlYzExMiIsIm5iZiI6MTc0NDM5MTY0OS4wNTksInN1YiI6IjY3Zjk0ZGUxMWJjNjM5NTY2YWRhNDJkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vo4tCiO4sJoTw41_839P52QrZk14Lsy5HmsDID5b7MU';

const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'accept': 'application/json'
  }
});

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  genre_ids: number[];
  vote_average: number;
}

interface GenreResponse {
  genres: Array<{
    id: number;
    name: string;
  }>;
}

interface MoodInput {
  text: string;
  sliders: {
    happiness: number;
    energy: number;
    humor: number;
  };
}

export const getGenres = async () => {
  try {
    const response = await tmdbAxios.get<GenreResponse>('/genre/movie/list', {
      params: {
        language: 'de'
      }
    });
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Fehler beim Laden der Genres');
  }
};

const GENRE_MAPPINGS = {
  // Comedy & Feel-Good
  happy: [35, 10751, 10402], // Comedy, Family, Music
  // Action & Adventure
  energetic: [28, 12, 878], // Action, Adventure, Science Fiction
  // Comedy & Romance
  humorous: [35, 10749], // Comedy, Romance
  // Drama & Thoughtful
  thoughtful: [18, 99, 36], // Drama, Documentary, History
};

export const getMoviesByMood = async (mood: MoodInput) => {
  try {
    console.log('Processing mood input:', mood);

    // Gewichte für die Genres basierend auf den Slider-Werten
    const genreWeights = new Map<number, number>();

    // Happiness beeinflusst Feel-Good Genres
    if (mood.sliders.happiness > 50) {
      GENRE_MAPPINGS.happy.forEach(genre => {
        genreWeights.set(genre, (genreWeights.get(genre) || 0) + (mood.sliders.happiness - 50) / 25);
      });
    }

    // Energy beeinflusst Action Genres
    if (mood.sliders.energy > 50) {
      GENRE_MAPPINGS.energetic.forEach(genre => {
        genreWeights.set(genre, (genreWeights.get(genre) || 0) + (mood.sliders.energy - 50) / 25);
      });
    }

    // Humor beeinflusst Comedy Genres
    if (mood.sliders.humor > 50) {
      GENRE_MAPPINGS.humorous.forEach(genre => {
        genreWeights.set(genre, (genreWeights.get(genre) || 0) + (mood.sliders.humor - 50) / 25);
      });
    }

    // Wenn alle Slider niedrig sind, füge nachdenkliche Genres hinzu
    if (Object.values(mood.sliders).every(value => value < 50)) {
      GENRE_MAPPINGS.thoughtful.forEach(genre => {
        genreWeights.set(genre, (genreWeights.get(genre) || 0) + 2);
      });
    }

    // Sortiere Genres nach Gewichtung
    const sortedGenres = Array.from(genreWeights.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre)
      .slice(0, 3);

    console.log('Selected genres:', sortedGenres);

    // Hole Filme für die ausgewählten Genres
    const genreResponse = await tmdbAxios.get<{ results: Movie[] }>('/discover/movie', {
      params: {
        language: 'de-DE',
        sort_by: 'popularity.desc',
        include_adult: false,
        with_genres: sortedGenres.join(','),
        'vote_count.gte': 100,
        'vote_average.gte': 6.5,
        page: 1,
      }
    });

    // Wenn Freitext vorhanden ist, mache auch eine Keyword-Suche
    let keywordResults: Movie[] = [];
    if (mood.text.trim()) {
      const keywordResponse = await tmdbAxios.get<{ results: Movie[] }>('/search/movie', {
        params: {
          language: 'de-DE',
          query: mood.text,
          include_adult: false,
          page: 1,
        }
      });
      keywordResults = keywordResponse.data.results;
    }

    // Kombiniere und dedupliziere die Ergebnisse
    const allMovies = [...genreResponse.data.results, ...keywordResults];
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());

    console.log('Found movies:', uniqueMovies.length);

    // Verarbeite die Filme und füge Erklärungen hinzu
    const processedMovies = uniqueMovies
      .filter(movie => movie.poster_path && movie.overview)
      .map(movie => {
        const matchingGenres = movie.genre_ids.filter(id => sortedGenres.includes(id));
        let explanation = 'Dieser Film passt zu deiner Stimmung, weil ';

        if (matchingGenres.length > 0) {
          if (mood.sliders.happiness > 70) {
            explanation += 'er positive und aufmunternde Elemente enthält';
          } else if (mood.sliders.energy > 70) {
            explanation += 'er voller Action und Spannung ist';
          } else if (mood.sliders.humor > 70) {
            explanation += 'er humorvolle und unterhaltsame Momente bietet';
          } else {
            explanation += 'er eine tiefgründige und nachdenkliche Geschichte erzählt';
          }
        }

        return {
          id: movie.id,
          title: movie.title,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          description: movie.overview,
          genres: movie.genre_ids,
          explanation,
          rating: movie.vote_average,
        };
      });

    if (processedMovies.length === 0) {
      throw new Error('Keine passenden Filme gefunden');
    }

    // Sortiere nach Relevanz basierend auf den Stimmungswerten
    return processedMovies.sort((a, b) => {
      const aGenreMatch = a.genres.filter(id => sortedGenres.includes(id)).length;
      const bGenreMatch = b.genres.filter(id => sortedGenres.includes(id)).length;
      return bGenreMatch - aGenreMatch || b.rating - a.rating;
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Fehler beim Laden der Filme');
  }
}; 