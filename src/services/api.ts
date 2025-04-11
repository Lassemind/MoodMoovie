import axios from 'axios'
import { config } from '../config'

interface MovieRecommendation {
  title: string
  year: number
  genres: string[]
  posterUrl: string
  description: string
  explanation: string
}

export const analyzeMood = async (mood: string, experienceId: string): Promise<MovieRecommendation> => {
  // First, analyze the mood using OpenAI
  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a movie recommendation assistant. Analyze the user\'s mood and suggest appropriate movie genres and keywords.',
        },
        {
          role: 'user',
          content: `I feel ${mood} and want ${experienceId}. What kind of movie should I watch?`,
        },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  // Extract genres and keywords from OpenAI response
  const analysis = openaiResponse.data.choices[0].message.content
  const genres = extractGenres(analysis)
  const keywords = extractKeywords(analysis)

  // Search for movies using TMDb API
  const tmdbResponse = await axios.get(
    `${config.tmdb.baseUrl}/discover/movie`,
    {
      params: {
        api_key: config.tmdb.apiKey,
        with_genres: genres.join(','),
        sort_by: 'vote_average.desc',
        language: 'de',
      },
    }
  )

  // Get the first movie from the results
  const movie = tmdbResponse.data.results[0]

  // Get movie details
  const movieDetails = await axios.get(
    `${config.tmdb.baseUrl}/movie/${movie.id}`,
    {
      params: {
        api_key: config.tmdb.apiKey,
        language: 'de',
      },
    }
  )

  // Generate explanation using OpenAI
  const explanationResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a movie recommendation assistant. Explain why this movie would be a good match for the user\'s mood.',
        },
        {
          role: 'user',
          content: `Why would ${movieDetails.data.title} be a good movie for someone who feels ${mood} and wants ${experienceId}?`,
        },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return {
    title: movieDetails.data.title,
    year: new Date(movieDetails.data.release_date).getFullYear(),
    genres: movieDetails.data.genres.map((g: any) => g.name),
    posterUrl: `${config.tmdb.imageBaseUrl}/w500${movieDetails.data.poster_path}`,
    description: movieDetails.data.overview,
    explanation: explanationResponse.data.choices[0].message.content,
  }
}

// Helper functions to extract genres and keywords from OpenAI response
const extractGenres = (text: string): string[] => {
  // This is a simplified version - in a real app, you'd want to map the text to actual TMDb genre IDs
  const commonGenres = ['Drama', 'Comedy', 'Action', 'Romance', 'Sci-Fi', 'Thriller']
  return commonGenres.filter(genre => text.toLowerCase().includes(genre.toLowerCase()))
}

const extractKeywords = (text: string): string[] => {
  // Extract keywords from the text - this is a simplified version
  return text.split(' ').filter(word => word.length > 3)
} 