import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../common/models/base-url';
import { User } from '../common/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public addUser(user: User): Observable<any> {
    return this.httpClient.post(`${baseUrl}/user/add`, user);
  }
}
