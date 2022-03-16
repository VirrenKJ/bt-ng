import { CompanyService } from './../../company-listing/services/company.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginService } from 'src/app/authentication/services/login.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private loginService: LoginService, private companyService: CompanyService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let authReq = req;
		const token = this.loginService.getToken();
		if (token != null) {
			authReq = authReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
		}
		return next.handle(authReq).pipe(
			tap(evt => {
				if (evt instanceof HttpResponse) {
					console.log(evt);
					if (evt.body && evt.body.success) {
						console.log(evt);
					}
				}
			}),
			catchError((err: any) => {
				if (err instanceof HttpErrorResponse) {
					if (err.error.status == 401) {
						this.loginService.logout();
						this.companyService.exitBugTracker();
						window.location.reload();
					}
				}
				return of(err);
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
