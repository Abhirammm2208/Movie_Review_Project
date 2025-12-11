export const environment = {
  production: true,
  apiBase: '', // Uses relative /api which gets rewritten by Vercel
  fallbackApiBase: '',
  // TMDB API key - set via Vercel Environment Variables
  // Configure in Vercel Dashboard > Project Settings > Environment Variables
  tmdbApiKey: ''
};
