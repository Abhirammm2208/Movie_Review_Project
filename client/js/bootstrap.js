// Bootstrap client: fetch free keys, store TMDB, then load UI modules
import freekeys from 'freekeys';

(async () => {
  try {
    const params = await freekeys();
    if (params && params.tmdb_key) {
      localStorage.setItem('TMDB_API_KEY', params.tmdb_key);
    }
  } catch (e) {
    // silently ignore if fetching fails; placeholders will be used
  }

  // Load helper and page logic after keys are set
  const TMDB = await import('./tmdb.js');
  window.TMDB = TMDB;

  // Initialize page after TMDB is loaded
  await import('./index-init.js');
})();

