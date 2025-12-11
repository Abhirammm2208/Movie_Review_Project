import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.scss'
})
export class AddReviewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reviews = inject(ReviewService);

  msg = signal<string | null>(null);
  msgClass = signal<'error' | 'success' | null>(null);

  form = this.fb.group({
    movieName: ['', Validators.required],
    rating: [7, [Validators.required, Validators.min(1), Validators.max(10)]],
    reviewText: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit(): void {
    const movie = this.route.snapshot.queryParamMap.get('movie');
    if (movie) this.form.patchValue({ movieName: movie });
  }

  setRating(r: number): void {
    this.form.patchValue({ rating: r });
  }

  submit(): void {
    if (this.form.invalid) {
      this.msgClass.set('error');
      this.msg.set('Please fill all required fields.');
      return;
    }
    this.msg.set('Submitting…');
    this.msgClass.set(null);
    const { movieName, rating, reviewText } = this.form.value;
    this.reviews.addReview({ movieName: movieName!, rating: Number(rating), reviewText: reviewText! }).subscribe({
      next: () => {
        this.msgClass.set('success');
        this.msg.set('Review added! Redirecting…');
        setTimeout(() => this.router.navigate(['/'], { queryParams: { movie: movieName } }), 600);
      },
      error: (err) => {
        this.msgClass.set('error');
        this.msg.set(err?.error?.msg || err.message || 'Failed to add review');
      }
    });
  }
}
