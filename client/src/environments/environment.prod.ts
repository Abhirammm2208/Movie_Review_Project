export const environment = {
  production: true,
  apiBase: '', // Uses relative /api which gets rewritten by Vercel
  fallbackApiBase: '',
  // TMDB API key - should be set via Vercel environment variable
  // This will be replaced at build time by Angular's file replacement
  tmdbApiKey: '269890f657dddf4635473cf4cf456576'
};
