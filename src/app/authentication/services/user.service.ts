import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../common/models/base-url';
import { User } from '../common/models/user';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private httpClient: HttpClient) {}

	public add(user: User): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/add`, user);
	}

	public addUserDetailsToCompany(user: User, dbUuid = null): Observable<any> {
		if (dbUuid) {
			return this.httpClient.post(`${baseUrl}/user/copy-user`, user, { headers: { 'x-tenant': dbUuid } });
		} else {
			return this.httpClient.post(`${baseUrl}/user/copy-user`, user);
		}
	}

	public updateUserDetailsToCompany(user: User): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/update-user`, user);
	}

	public update(user: User): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/update`, user);
	}

	public changePassword(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/change-password`, data);
	}

	public sendToken(email: any): Observable<any> {
		return this.httpClient.get(`${baseUrl}/user/send-token`, { params: new HttpParams().set('email', email) });
	}

	public validatePasswordResetToken(token: any): Observable<any> {
		return this.httpClient.get(`${baseUrl}/user/validate-token`, { params: new HttpParams().set('token', token) });
	}

	public resetPassword(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/reset-password`, data);
	}

	public getList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/list`, data);
	}

	public getEmployeeList(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/employee-list`, data);
	}

	public getEmployeeListByCompany(data: any): Observable<any> {
		return this.httpClient.post(`${baseUrl}/user/company-employee`, data);
	}

	public getById(id: number): Observable<any> {
		return this.httpClient.get(`${baseUrl}/user/${id}`);
	}

	public getByUsername(username: string): Observable<any> {
		return this.httpClient.get(`${baseUrl}/user/username`, { params: new HttpParams().set('username', username) });
	}

	public getByEmail(email: string): Observable<any> {
		return this.httpClient.get(`${baseUrl}/user/email`, { params: new HttpParams().set('email', email) });
	}

	public delete(id): Observable<any> {
		return this.httpClient.delete(`${baseUrl}/user/delete`, { params: new HttpParams().set('id', id) });
	}
}
