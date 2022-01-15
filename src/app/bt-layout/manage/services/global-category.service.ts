import { GlobalCategory } from './../models/global-category';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';

@Injectable({
	providedIn: 'root',
})
export class GlobalCategoryService {
	constructor(private httpClient: HttpClient) {}

	public add(globalCategory: GlobalCategory): Observable<any> {
		return this.httpClient.post(`${baseUrl}/category/add`, globalCategory);
	}

	public update(globalCategory: GlobalCategory): Observable<any> {
		return this.httpClient.post(`${baseUrl}/category/update`, globalCategory);
	}

	public getList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/category/list`, data);
	}

	public getById(id: number): Observable<any> {
		return this.httpClient.get(`${baseUrl}/category/${id}`);
	}

	public delete(id): Observable<any> {
		return this.httpClient.delete(`${baseUrl}/category/delete`, { params: new HttpParams().set('id', id) });
	}
}
