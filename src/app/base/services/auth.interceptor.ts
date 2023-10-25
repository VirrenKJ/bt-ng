import { CompanyService } from './../../company-listing/services/company.service';
import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { LoginService } from 'src/app/authentication/services/login.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private companyService: CompanyService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.loginService.getToken();
    const userId = this.loginService.getUser()?.id;
    const role = this.loginService.getUserRole();
    if (token != null && userId != null && role != null) {
      authReq = authReq.clone({ setHeaders: { Authorization: `Bearer ${ token }`, 'user-id': `${ userId }`, role: `${ role }` } });
    }
    return next.handle(authReq).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.body && evt.body.status == 200) {
            console.log(evt.body);
          }
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          if (err.error && err.error.status == 403) {
            this.loginService.logout();
            this.companyService.exitBugTracker();
            window.location.reload();
            return of(null);
          }
        }
        return throwError(err);
      })
    );
  }
}

export const authInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];
