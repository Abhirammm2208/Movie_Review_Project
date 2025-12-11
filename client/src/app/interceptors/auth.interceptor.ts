import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const headers = token ? req.headers.set('Authorization', `Bearer ${token}`) : req.headers;
  const cloned = req.clone({ headers });
  return next(cloned);
};
