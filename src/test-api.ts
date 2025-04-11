import axios from 'axios';

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGY2YzA4OTI3N2U0NDE2YTBiNDhmNjkwNDBlYzExMiIsIm5iZiI6MTc0NDM5MTY0OS4wNTksInN1YiI6IjY3Zjk0ZGUxMWJjNjM5NTY2YWRhNDJkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vo4tCiO4sJoTw41_839P52QrZk14Lsy5HmsDID5b7MU';

async function testTMDBApi() {
  try {
    // Test the genres endpoint
    const genresResponse = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        language: 'de'
      }
    });
    console.log('Genres response:', genresResponse.data);

    // Test the discover movies endpoint
    const moviesResponse = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        language: 'de',
        sort_by: 'vote_average.desc',
        'vote_count.gte': 1000,
        with_genres: '18,10749', // Drama, Romance
        page: 1
      }
    });
    console.log('Movies response:', moviesResponse.data);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else {
      console.error('Error:', error);
    }
  }
}

// Run the test
testTMDBApi(); 