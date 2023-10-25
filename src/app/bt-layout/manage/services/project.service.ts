import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  public add(project: Project): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/project/add`, project);
  }

  public update(project: Project): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/project/update`, project);
  }

  public getList(data: any): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/project/list`, data);
  }

  public getById(id: number): Observable<any> {
    return this.httpClient.get(`${ baseUrl }/project/${ id }`);
  }

  public delete(id): Observable<any> {
    return this.httpClient.delete(`${ baseUrl }/project/delete`, { params: new HttpParams().set('id', id) });
  }
}
