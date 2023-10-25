import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/authentication/common/models/base-url';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private httpClient: HttpClient) {}

  public setTenant(dbUuid: string) {
    localStorage.setItem('x-tenant', dbUuid);
    return true;
  }

  public getTenant() {
    return localStorage.getItem('x-tenant');
  }

  public tenantExist() {
    const tenant = localStorage.getItem('x-tenant');
    if (tenant === undefined || tenant === null || tenant === '') {
      return false;
    } else {
      return true;
    }
  }

  public temporarilyRemoveTenant() {
    let dbUuid: string = null;
    if (this.tenantExist()) {
      dbUuid = this.getTenant();
      this.exitBugTracker();
    }
    return dbUuid;
  }

  public setCompany(company: Company) {
    localStorage.setItem('x-company', JSON.stringify(company));
    return true;
  }

  public getCompany() {
    let company = localStorage.getItem('x-company');
    if (company) {
      return JSON.parse(company);
    } else {
      return null;
    }
  }

  public exitBugTracker() {
    localStorage.removeItem('x-tenant');
    return true;
  }

  public add(data: any): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/company/add`, data);
  }

  public update(data: any): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/company/update`, data);
  }

  public copyCompanyToTenant(data: any, dbUuid: string): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/company/copy-company`, data, { headers: { 'x-tenant': dbUuid } });
  }

  public getList(data: any): Observable<any> {
    return this.httpClient.post(`${ baseUrl }/company/list`, data);
  }

  public getListByEmployeeId(id: number): Observable<any> {
    return this.httpClient.get(`${ baseUrl }/company/employer-list/${ id }`);
  }

  public getById(id: number): Observable<any> {
    return this.httpClient.get(`${ baseUrl }/company/${ id }`);
  }

  public delete(id): Observable<any> {
    return this.httpClient.delete(`${ baseUrl }/company/delete`, { params: new HttpParams().set('id', id) });
  }
}
