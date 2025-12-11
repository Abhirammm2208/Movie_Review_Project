import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  msg = signal<string | null>(null);
  msgClass = signal<'error' | 'success' | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.msg.set('Please fill email and password.');
      this.msgClass.set('error');
      return;
    }
    this.msg.set('Signing in…');
    this.msgClass.set(null);
    const { email, password } = this.form.value;
    this.auth.signin(email!, password!).subscribe({
      next: () => {
        this.msgClass.set('success');
        this.msg.set('Signed in! Redirecting…');
        const back = this.route.snapshot.queryParamMap.get('back') || '/';
        setTimeout(() => this.router.navigateByUrl(back), 400);
      },
      error: (err) => {
        this.msgClass.set('error');
        this.msg.set(err?.error?.msg || err.message || 'Login failed');
      }
    });
  }
}
