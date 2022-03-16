import { User } from './../common/models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../common/models/base-url';

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	user = new User();
	userRole: string = 'Viewer';

	constructor(private httpClient: HttpClient) {}

	public authenticate(data) {
		return this.httpClient.post(`${baseUrl}/authenticate`, data);
	}

	// public getCurrentUser() {
	//   return this.httpClient.get(`${baseUrl}/current-user`);
	// }

	public setTokenAndUser(response) {
		localStorage.setItem('token', response.token);
		this.setUser(response.user);
		this.user = response.user;
		return true;
	}

	public isLoggedIn() {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');
		if (token === undefined || token === null || token === '' || user === undefined || user === null || user === '') {
			this.logout();
			return false;
		} else {
			return true;
		}
	}

	public logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return true;
	}

	public getToken() {
		return localStorage.getItem('token');
	}

	public setUser(user) {
		localStorage.setItem('user', JSON.stringify(user));
	}

	public getUser() {
		let user = localStorage.getItem('user');
		if (user != null) {
			return JSON.parse(user);
		} else {
			this.logout();
			return null;
		}
	}

	public getUserRole() {
		return this.user.roles[0].roleName;
	}
}
