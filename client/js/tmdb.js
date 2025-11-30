// Lightweight TMDB helper (ES module)
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function getKey(){ return localStorage.getItem('TMDB_API_KEY') || '' }

export async function searchMovie(title){
  const key = getKey();
  if(!key) return null;
  const url = `${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(title)}&include_adult=false`;
  const res = await fetch(url);
  if(!res.ok) return null;
  const data = await res.json();
  const first = (data && data.results && data.results[0]) ? data.results[0] : null;
  if(!first || !first.poster_path) return null;
  return IMG_BASE + first.poster_path;
}
