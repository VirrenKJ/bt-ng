import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';
import { Company } from '../models/company';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	constructor(private httpClient: HttpClient) {}

	public setTenant(dbUuid: string) {
		localStorage.setItem('x-tenant', dbUuid);
		return true;
	}

	public getTenant() {
		return localStorage.getItem('x-tenant');
	}

	public setCompany(company: Company) {
		localStorage.setItem('x-company', JSON.stringify(company));
		return true;
	}

	public getCompany() {
		return localStorage.getItem('x-company');
	}

	public exitBugTracker() {
		localStorage.removeItem('x-tenant');
		return true;
	}

	public add(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/add`, data);
	}

	public update(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/update`, data);
	}

	public copyCompanyToTenant(data: any, dbUuid: string): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/copy-company`, data, { headers: { 'x-tenant': dbUuid } });
	}

	public getList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/company/list`, data);
	}

	public getListByEmployeeId(id: number): Observable<any> {
		return this.httpClient.get(`${baseUrl}/company/employer-list/${id}`);
	}

	public getById(id: number): Observable<any> {
		return this.httpClient.get(`${baseUrl}/company/${id}`);
	}

	public delete(id): Observable<any> {
		return this.httpClient.delete(`${baseUrl}/company/delete`, { params: new HttpParams().set('id', id) });
	}
}
