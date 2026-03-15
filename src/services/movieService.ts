import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3'

export const fetchMovies = async (
  query: string,
  page = 1,
): Promise<MovieSearchResponse> => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const bearerToken = import.meta.env.VITE_TMDB_TOKEN;

  if (!apiKey && !bearerToken) {
    throw new Error('TMDB API credentials are missing');
  }

  const headers = bearerToken
    ? { Authorization: `Bearer ${bearerToken}` }
    : undefined;

  const response = await axios.get<MovieSearchResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page,
        ...(apiKey ? { api_key: apiKey } : {}),
      },
      headers,
    },
  );

  return response.data;
};
