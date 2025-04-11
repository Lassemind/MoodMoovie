export const config = {
  tmdb: {
    apiKey: process.env.VITE_TMDB_API_KEY,
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
  },
  openai: {
    apiKey: process.env.VITE_OPENAI_API_KEY,
  },
} 