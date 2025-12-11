import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FreekeysUtil } from '../../services/freekeys.util';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  msg = signal<string | null>(null);
  msgClass = signal<'error' | 'success' | null>(null);
  usernameAvailable = signal<boolean | null>(null);
  usernameChecking = signal(false);

  form = this.fb.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    // Debounce username availability check using FreekeysUtil
    const checkUsername = FreekeysUtil.debounce((username: string) => {
      if (username.length < 3) {
        this.usernameAvailable.set(null);
        this.usernameChecking.set(false);
        return;
      }
      this.usernameChecking.set(true);
      // In a real app, you'd check against your backend
      this.usernameAvailable.set(true);
      this.usernameChecking.set(false);
    }, 500);

    this.form.get('username')?.valueChanges.subscribe((value) => {
      if (value) checkUsername(value);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.msg.set('Please fill all fields correctly.');
      this.msgClass.set('error');
      return;
    }
    this.msg.set('Creating account…');
    this.msgClass.set(null);
    const { fullName, username, email, password } = this.form.value;
    this.auth.signup(fullName!, username!, email!, password!).subscribe({
      next: () => {
        this.msgClass.set('success');
        this.msg.set('Account created! Redirecting…');
        setTimeout(() => this.router.navigateByUrl('/'), 500);
      },
      error: (err) => {
        this.msgClass.set('error');
        this.msg.set(err?.error?.msg || err.message || 'Registration failed');
      }
    });
  }
}
