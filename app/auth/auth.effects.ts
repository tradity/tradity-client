
import {of as observableOf,  Observable } from 'rxjs';

import {tap, switchMap, map, catchError, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApiService } from '../core/api.service';
import * as authActions from './auth.actions';
import * as appActions from '../app.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  login = this.actions.pipe(
    ofType(authActions.LOGIN),
    switchMap((action: authActions.Login) => this.apiService
      .post('/login', {
        name: action.payload.username,
        pw: action.payload.password,
        stayloggedin: action.payload.stayLoggedIn
      }).pipe(
      map(res => {
        if (res.code === 200) {
          this.apiService.setAuthKey(res.key);
          return new authActions.LoginSuccess();
        }
      }),
      catchError((error: any) => observableOf(new authActions.LoginFailed())),)
    )
  );

  @Effect()
  loadUser = this.actions.pipe(
    ofType(authActions.LOAD_USER),
    switchMap((action: authActions.LoadUser) => this.apiService
      .get('/user/$self?nohistory=' + String(action.payload)).pipe(
      map(res => new authActions.ReceiveUser(res)),)
    )
  );
  
  @Effect()
  loginSuccess = this.actions.pipe(
    ofType(authActions.LOGIN_SUCCESS),
    tap(() => this.router.navigateByUrl('/')),
    map(() => new authActions.LoadUser(true))
  );
  
  @Effect()
  loginFailed = this.actions.pipe(
    ofType(authActions.LOGIN_FAILED),
    map(() => new appActions.CreateNotification({ type: 'error', message: 'Wrong username or password' }))
  );
  
  @Effect()
  logout = this.actions.pipe(
    ofType(authActions.LOGOUT),
    mergeMap(() => this.apiService
      .post('/logout', {}).pipe(
      map(res => {
        if (res.code === 200) {
          return new authActions.LogoutSuccess();
        }
      }),)
    )
  );

  @Effect({ dispatch: false })
  logoutSuccess = this.actions.pipe(
    ofType(authActions.LOGOUT_SUCCESS),
    tap(() => {
      this.apiService.setAuthKey(null);
      this.router.navigateByUrl('login');
    })
  );
  
  @Effect()
  register = this.actions.pipe(
    ofType(authActions.REGISTER),
    switchMap((action: authActions.Register) => this.apiService
      .post(
        '/register',
        action.payload
      ).pipe(
      map(res => {
        if (res.code === 200) {
          return new authActions.LoginSuccess();
        }
        return new authActions.RegistrationFailed();
      }),)
    )
  );
  
  @Effect({ dispatch: false })
  notLoggedIn = this.actions.pipe(
    ofType(authActions.NOT_LOGGED_IN),
    tap(() => this.router.navigateByUrl('login'))
  );

  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService,
    private router: Router
  ) {}
}