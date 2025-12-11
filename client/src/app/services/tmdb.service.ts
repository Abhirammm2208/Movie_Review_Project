import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, timeout, Observable } from 'rxjs';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

// Free TMDB API key from freekeys package - these are public community keys
const TMDB_API_KEY = '269890f657dddf4635473cf4cf456576';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  searchPoster(title: string): Observable<string | null> {
    // Only fetch in browser to avoid SSR CORS issues
    if (!this.isBrowser()) {
      return of(null);
    }

    const url = `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&include_adult=false`;
    
    return this.http.get<any>(url).pipe(
      timeout(8000),
      map((data) => {
        if (!data?.results || data.results.length === 0) {
          return null;
        }
        const first = data.results[0];
        if (!first?.poster_path) return null;
        return IMG_BASE + first.poster_path;
      }),
      catchError((err) => {
        // Only log errors in browser
        if (this.isBrowser()) {
          console.warn(`TMDB poster not found for "${title}"`);
        }
        return of(null);
      })
    );
  }
}
