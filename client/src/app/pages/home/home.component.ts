import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReviewService, Review } from '../../services/review.service';
import { TmdbService } from '../../services/tmdb.service';
import { AuthService } from '../../services/auth.service';
import { FreekeysUtil } from '../../services/freekeys.util';

interface FeaturedCard {
  title: string;
  poster?: string | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reviewsApi = inject(ReviewService);
  tmdb = inject(TmdbService);  // Make public for template access
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  searchForm = this.fb.group({ movie: [''] });
  apiKeyForm = this.fb.group({ apiKey: [''] });
  loading = signal(false);
  error = signal<string | null>(null);
  reviews = signal<Review[]>([]);
  showApiConfig = signal(false);
  featured: FeaturedCard[] = [
    { title: 'Inception' },
    { title: 'Interstellar' },
    { title: 'The Dark Knight' },
    { title: 'Avatar' },
    { title: 'Titanic' },
    { title: 'Jurassic Park' },
    { title: 'The Matrix' },
    { title: 'Gladiator' },
    { title: 'Forrest Gump' },
    { title: 'The Godfather' }
  ];

  ngOnInit(): void {
    // Setup debounced search using FreekeysUtil
    const debouncedSearch = FreekeysUtil.debounce(() => {
      this.search();
    }, 600);

    this.route.queryParamMap.subscribe((params) => {
      const movie = params.get('movie');
      if (movie) {
        this.searchForm.patchValue({ movie });
        this.search();
      }
    });

    // Watch for movie input changes and debounce search
    this.searchForm.get('movie')?.valueChanges.subscribe(() => {
      debouncedSearch();
    });

    // Only preload posters if TMDB API key is configured
    if (this.tmdb.hasKey()) {
      this.featured.forEach((f) => {
        this.tmdb.searchPoster(f.title).subscribe((poster) => (f.poster = poster));
      });
    }
  }

  reviewInitials(r: Review): string {
    const who = (r.reviewer && r.reviewer.username) ? r.reviewer.username : 'Anonymous';
    return who.trim().slice(0, 2).toUpperCase();
  }

  search(): void {
    const movie = this.searchForm.value.movie?.trim();
    if (!movie) {
      this.error.set('Please enter a movie name');
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    this.reviewsApi.listReviews(movie).subscribe({
      next: (list) => {
        this.reviews.set(list || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.msg || err.message || 'Failed to load reviews');
        this.reviews.set([]);
        this.loading.set(false);
      }
    });
  }

  addFeatured(title: string): void {
    this.searchForm.patchValue({ movie: title });
    this.search();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  saveApiKey(): void {
    const key = this.apiKeyForm.value.apiKey?.trim();
    if (key) {
      this.tmdb.setKey(key);
      this.showApiConfig.set(false);
      this.apiKeyForm.reset();
      // Reload featured posters
      this.featured.forEach((f) => {
        this.tmdb.searchPoster(f.title).subscribe((poster) => (f.poster = poster));
      });
    }
  }
}
