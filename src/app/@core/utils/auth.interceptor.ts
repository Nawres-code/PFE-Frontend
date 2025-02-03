import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { SigninService } from '../service/signin.service';
import { Router } from '@angular/router';

 const TOKEN_HEADER_KEY = 'Authorization';       
 const REFRESHTOKEN_KEY = 'auth-refreshtoken';
 const TOKEN_KEY = 'token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private signinservice: SigninService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq)
    .pipe(catchError(error => {
      if (error instanceof HttpErrorResponse
         && !authReq.url.includes('users/signin')
       && error.status === 401) {
       return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<Object>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem(REFRESHTOKEN_KEY);

      if (refreshToken)
        return this.signinservice.refreshToken(refreshToken).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            localStorage.setItem(TOKEN_KEY, token.accessToken);
            localStorage.setItem(REFRESHTOKEN_KEY, token.refreshToken);

            this.refreshTokenSubject.next(token.refreshToken);
            
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.router.navigate(["/signin"], { queryParams: { 'logout': '', 'msg':'expiredSession' } });
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];