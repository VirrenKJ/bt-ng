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

  public update(user: User): Observable<any> {
    return this.httpClient.post(`${baseUrl}/user/update`, user);
  }

  public getList(data: any): Observable<any> {
    return this.httpClient.post(`${baseUrl}/user/list`, data);
  }

  public getById(id: number): Observable<any> {
    return this.httpClient.get(`${baseUrl}/user/${id}`);
  }

  public delete(id): Observable<any> {
    return this.httpClient.delete(`${baseUrl}/user/add`, { params: new HttpParams().set('id', id) });
  }
}
