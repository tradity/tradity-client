import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { getAuthKey } from '../auth/auth.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable()
export class ApiService {
  
  private options: RequestOptions;
  private baseUrl: string;

  constructor(private http: Http, private router: Router, private store: Store<any>) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers });

    let hostname = document.location.hostname.includes('.tradity.de') ? document.location.hostname : 'dev.tradity.de';
    this.baseUrl = 'https://' + hostname + ':443/api/v1';

    this.store.select(getAuthKey).subscribe((key: string) => {
      if (key != null) this.options.headers.set('Authorization', key);
      else this.options.headers.delete('Authorization');
    });
  }
  
  private handleError = (error: Response) => {
    if (error.status == 401) {
      this.store.dispatch(new authActions.NotLoggedIn());
      return Observable.empty();
    }
    return Observable.throw(error.json());
  }
  
  get(url: string) : Observable<Response> {
    return this.http.get(this.baseUrl + url, this.options).catch(this.handleError);
  }
  
  post(url: string, body: any) : Observable<Response> {
    return this.http.post(this.baseUrl + url, JSON.stringify(body), this.options).catch(this.handleError);
  }
}