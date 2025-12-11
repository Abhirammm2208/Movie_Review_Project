import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse { token?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenKey = 'TOKEN';
  private base = (environment.apiBase || '').replace(/\/$/, '');
  private authedSubject = new BehaviorSubject<boolean>(this.hasToken());

  authed$ = this.authedSubject.asObservable();

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private hasToken(): boolean {
    return this.isBrowser() && !!localStorage.getItem(this.tokenKey);
  }

  get token(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  get apiBase(): string {
    return this.base || '';
  }

  private build(path: string): string {
    const b = this.base || '';
    return `${b}${path}`;
  }

  signin(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.build('/api/auth/signin'), { email, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  signup(fullName: string, username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(this.build('/api/auth/signup'), { fullName, username, email, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  signout(): Observable<void> {
    return this.http.post<void>(this.build('/api/auth/signout'), {}).pipe(
      tap(() => this.clearToken())
    );
  }

  clearToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
    this.authedSubject.next(false);
  }

  private setToken(token?: string): void {
    if (token && this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
      this.authedSubject.next(true);
    }
  }

  isAuthed(): boolean {
    return this.hasToken();
  }
}
