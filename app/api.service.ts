import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {
  
  private options: RequestOptions;
  private baseUrl = 'https://dev.tradity.de:443/api/v1';

  constructor(private http: Http) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers });
  }
  
  setAuthToken(token: string) : void {
    this.options.headers.append('Authorization', token);
  }
  
  delAuthToken() : void {
    this.options.headers.delete('Authorization');
  }
  
  get(url: string) : Observable<Response> {
    return this.http.get(this.baseUrl + url, this.options);
  }
  
  post(url: string, body: any) : Observable<Response> {
    return this.http.post(this.baseUrl + url, JSON.stringify(body), this.options);
  }
}