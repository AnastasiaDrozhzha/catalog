import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../model/property';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  private propertiesUrl: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.propertiesUrl = 'http://localhost:8080/properties';
  }

  searchPage(search: string, offset: number, pageSize: number): Observable<Page<Property>> {
    const searchHttpOptions = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('search', search).set('offset', offset).set('pageSize', pageSize)
    }
    return this.http.get<Page<Property>>(this.propertiesUrl, searchHttpOptions);
  }

  findById(propertyId: number): Observable<Property> {
    const url = `${this.propertiesUrl}/${propertyId}`;
    return this.http.get<Property>(url);
  }

  create(property: Property): Observable<Property> {
    return this.http.post<Property>(this.propertiesUrl, property, this.httpOptions);;
  }

  update(property: Property): Observable<Property> {
    const url = `${this.propertiesUrl}/${property.id}`;
    return this.http.put<Property>(url, property, this.httpOptions);
  }

  delete(propertyId: number): Observable<void>{
    const url = `${this.propertiesUrl}/${propertyId}`;

    return this.http.delete<void>(url, this.httpOptions);
  }
}
