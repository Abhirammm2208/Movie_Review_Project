import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Review {
  reviewer?: { username?: string };
  rating: number;
  reviewText: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private base = (environment.apiBase || '').replace(/\/$/, '');

  private build(path: string): string {
    const b = this.base || '';
    return `${b}${path}`;
  }

  listReviews(movieName: string) {
    const safe = encodeURIComponent(movieName.trim());
    return this.http.get<Review[]>(this.build(`/api/reviews/${safe}`));
  }

  addReview(input: { movieName: string; rating: number; reviewText: string }) {
    return this.http.post<void>(this.build('/api/reviews'), input);
  }
}
