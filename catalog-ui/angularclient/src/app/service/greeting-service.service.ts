import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Greeting } from '../model/greeting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GreetingService {

  private greetingUrl: string;

  constructor(private http: HttpClient) {
    this.greetingUrl = 'http://localhost:8080/greeting_json';
  }

  public findGreeting(): Observable<Greeting> {
    return this.http.get<Greeting>(this.greetingUrl);
  }
}
