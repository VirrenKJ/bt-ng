import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';
import { Issue } from '../models/issue';

@Injectable({
	providedIn: 'root',
})
export class IssueService {
	constructor(private httpClient: HttpClient) {}

	public add(issue: Issue): Observable<any> {
		return this.httpClient.post(`${baseUrl}/issue/add`, issue);
	}

	public update(issue: Issue): Observable<any> {
		return this.httpClient.post(`${baseUrl}/issue/update`, issue);
	}

	public getList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/issue/list`, data);
	}

	public getById(id: number): Observable<any> {
		return this.httpClient.get(`${baseUrl}/issue/${id}`);
	}

	public delete(id): Observable<any> {
		return this.httpClient.delete(`${baseUrl}/issue/delete`, { params: new HttpParams().set('id', id) });
	}
}
