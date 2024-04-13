import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { Template } from '../model/template';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  private templatesUrl: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.templatesUrl = 'http://localhost:8080/templates';
  }

  searchPage(search: string, offset: number, pageSize: number): Observable<Page<Template>> {
    const searchHttpOptions = {
      headers: this.httpOptions.headers,
      params: new HttpParams().set('search', search).set('offset', offset).set('pageSize', pageSize)
    }
    return this.http.get<Page<Template>>(this.templatesUrl, searchHttpOptions);
  }

  findById(templateId: number): Observable<Template> {
    const url = `${this.templatesUrl}/${templateId}`;
    return this.http.get<Template>(url);
  }

  create(template: Template): Observable<Template> {
    console.log("Added template: " + JSON.stringify(template));
    return this.http.post<Template>(this.templatesUrl, template, this.httpOptions);;
  }

  update(template: Template): Observable<Template> {
    console.log("Updated template: " + JSON.stringify(template));
    const url = `${this.templatesUrl}/${template.id}`;
    return this.http.put<Template>(url, template, this.httpOptions);
  }

  delete(templateId: number): Observable<void>{
    console.log("Delete template with id: " + templateId);
    const url = `${this.templatesUrl}/${templateId}`;

    return this.http.delete<void>(url, this.httpOptions);
  }

}
