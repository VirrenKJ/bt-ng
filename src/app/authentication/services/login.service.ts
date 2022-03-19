import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from '../common/models/base-url';
import { User } from '../common/models/user';

@Injectable({
	providedIn: 'root',
})
export class LoginService {
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
		localStorage.removeItem('edit-username');
		localStorage.removeItem('edit-email');
		localStorage.removeItem('x-company');
		return true;
	}

	public getToken() {
		return localStorage.getItem('token');
	}

	public setUser(user) {
		localStorage.setItem('user', JSON.stringify(user));
	}

	public getUser() {
		let userString = localStorage.getItem('user');
		if (userString != null) {
			let user: User = JSON.parse(userString);
			return user;
		} else {
			this.logout();
			return null;
		}
	}

	public getUserRole() {
		let user: User = this.getUser();
		return user?.roles[0]?.roleName;
	}
}
