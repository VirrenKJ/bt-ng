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

  public getCurrentUser() {
    return this.httpClient.get(`${baseUrl}/current-user`);
  }

  public setToken(token) {
    localStorage.setItem('token', token);
    return true;
  }

  public isLoggedIn() {
    let token = localStorage.getItem('token');
    if (token === undefined || token === null || token === '') {
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
    let user: User = this.getUser();
    return user?.roles[0]?.roleName;
  }
}
