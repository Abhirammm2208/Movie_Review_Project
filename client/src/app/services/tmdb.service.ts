import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, timeout } from 'rxjs';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private http = inject(HttpClient);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private getKey(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('TMDB_API_KEY');
  }

  setKey(key: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('TMDB_API_KEY', key);
    }
  }

  hasKey(): boolean {
    return !!this.getKey();
  }

  searchPoster(title: string) {
    const key = this.getKey();
    if (!key) {
      return of<string | null>(null);
    }

    const url = `${TMDB_BASE}/search/movie?api_key=${key}&query=${encodeURIComponent(title)}&include_adult=false`;
    
    return this.http.get<any>(url, { 
      headers: {
        'Accept': 'application/json'
      }
    }).pipe(
      timeout(5000), // 5 second timeout
      map((data) => {
        if (!data?.results || data.results.length === 0) {
          return null;
        }
        const first = data.results[0];
        if (!first?.poster_path) return null;
        return IMG_BASE + first.poster_path;
      }),
      catchError((err) => {
        console.error(`TMDB API Error for "${title}":`, err?.status, err?.message);
        return of(null);
      })
    );
  }
}
