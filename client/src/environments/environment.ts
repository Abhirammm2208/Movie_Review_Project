export const environment = {
  production: false,
  apiBase: '', // empty uses relative /api with dev proxy; set to full URL for production if needed
  fallbackApiBase: 'http://localhost:5000',
  // TMDB API key - set via environment variable TMDB_API_KEY or use default for development
  tmdbApiKey: '269890f657dddf4635473cf4cf456576'
};
