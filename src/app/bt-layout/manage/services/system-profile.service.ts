import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';
import { SystemProfile } from '../models/system-profile';

@Injectable({
  providedIn: 'root',
})
export class SystemProfileService {
  constructor(private httpClient: HttpClient) {}

  public add(systemProfile: SystemProfile): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/system-profile/add`, systemProfile);
  }

  public update(systemProfile: SystemProfile): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/system-profile/update`, systemProfile);
  }

  public getList(data: any): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/system-profile/list`, data);
  }

  public getById(id: number): Observable<any> {
    return this.httpClient.get(`${ baseUrl }/system-profile/${ id }`);
  }

  public delete(id): Observable<any> {
    return this.httpClient.delete(`${ baseUrl }/system-profile/delete`, { params: new HttpParams().set('id', id) });
  }
}
