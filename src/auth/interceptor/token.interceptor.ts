import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getToken()) {
      req = req.clone({
       headers: req.headers.set('Authorization', this.authService.getToken() as string)
     });
   }

    return next.handle(req);
  }
}
