export const environment = {
  production: false,
  apiBase: '', // empty uses relative /api with dev proxy; set to full URL for production if needed
  fallbackApiBase: 'http://localhost:5000',
  // TMDB API key - get your free key at https://www.themoviedb.org/settings/api
  // For local development, create environment.local.ts with your key
  tmdbApiKey: ''
};
