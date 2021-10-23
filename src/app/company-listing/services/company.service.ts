import { Injectable } from '@angular/core';
import { Company } from '../models/company';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	constructor() {}

	public setTenant(company: Company) {
		localStorage.setItem('x-tenant', company.dbName);
		return true;
	}

	public getTenant() {
		return localStorage.getItem('x-tenant');
	}
}
