import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

import { inject } from '@angular/core';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService);

  if (authSvc.getToken()) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', authSvc.getToken() as string),
    });

    return next(authRequest);

  } else {
    return next(req);
  }
};
