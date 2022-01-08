import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyService } from 'src/app/company-listing/services/company.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
	constructor(private companyService: CompanyService) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let authReq = request;
		const dbUUID = this.companyService.getTenant();
		if (dbUUID != null) {
			authReq = authReq.clone({ setHeaders: { 'x-tenant': dbUUID } });
		}
		return next.handle(authReq);
	}
}
export const tenantInterceptorProvider = [
	{
		provide: HTTP_INTERCEPTORS,
		useClass: TenantInterceptor,
		multi: true,
	},
];
