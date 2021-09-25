import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../common/models/base-url';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private httpClient: HttpClient) {}

  public getList(data: any): Observable<any> {
    return this.httpClient.post(`${baseUrl}/role/list`, data);
  }
}
