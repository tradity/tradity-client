import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuthKey } from '../auth/auth.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable()
export class ApiService {
  private baseUrl: string;
  private headers: { [key: string]: string };

  constructor(private store: Store<any>) {
    this.headers = { 'Content-Type': 'application/json' };

    let hostname = document.location.hostname.includes('.tradity.de') ? document.location.hostname : 'dev.tradity.de';
    this.baseUrl = 'https://' + hostname + ':443/api/v1';

    this.store.select(getAuthKey).subscribe((key: string) => {
      if (key != null) this.headers['Authorization'] = key;
      else delete this.headers['Authorization'];
    });
  }

  private request(method: string, url: string, body?: any): Observable<any> {
    return new Observable(subscriber => {
      fetch(this.baseUrl + url, {
        method: method,
        headers: this.headers,
        body: body
      }).then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            this.store.dispatch(new authActions.NotLoggedIn());
            subscriber.complete();
          } else {
            res.json().then(res => subscriber.error(res));
          }
        } else {
          res.json().then(res => {
            subscriber.next(res);
            subscriber.complete();
          })
        }
      }).catch(err => {
        subscriber.error(err);
      });
    })
  }
  
  get(url: string) : Observable<any> {
    return this.request('GET', url);
  }
  
  post(url: string, body: any) : Observable<any> {
    return this.request('POST', url, JSON.stringify(body));
  }
}