import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';
import { User } from 'src/app/authentication/common/models/user';
import { Company } from '../models/company';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	constructor(private httpClient: HttpClient) {}

	public setTenant(company: Company) {
		localStorage.setItem('x-tenant', company.dbName);
		return true;
	}

	public getTenant() {
		return localStorage.getItem('x-tenant');
	}

	public add(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/add`, data);
	}

	public update(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/update`, data);
	}

	public getList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/list`, data);
	}

	public getBusinessList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/business-list`, data);
	}

	public getById(id: number): Observable<any> {
		return this.httpClient.get(`${baseUrl}/company/${id}`);
	}

	public delete(id): Observable<any> {
		return this.httpClient.delete(`${baseUrl}/company/delete`, { params: new HttpParams().set('id', id) });
	}
}