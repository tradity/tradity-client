
import {of as observableOf,  Observable } from 'rxjs';

import {tap, switchMap, map, catchError, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApiService } from '../core/api.service';
import * as authActions from './auth.actions';
import * as appActions from '../app.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  login = this.actions
    .ofType(authActions.LOGIN).pipe(
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
    ));

  @Effect()
  loadUser = this.actions
    .ofType(authActions.LOAD_USER).pipe(
    switchMap((action: authActions.LoadUser) => this.apiService
      .get('/user/$self?nohistory=' + String(action.payload)).pipe(
      map(res => new authActions.ReceiveUser(res)),)
    ));
  
  @Effect()
  loginSuccess = this.actions
    .ofType(authActions.LOGIN_SUCCESS).pipe(
    tap(() => this.router.navigateByUrl('/')),
    map(() => new authActions.LoadUser(true)),);
  
  @Effect()
  loginFailed = this.actions
    .ofType(authActions.LOGIN_FAILED).pipe(
    map(() => new appActions.CreateNotification({ type: 'error', message: 'Wrong username or password' })));
  
  @Effect()
  logout = this.actions
    .ofType(authActions.LOGOUT).pipe(
    mergeMap(() => this.apiService
      .post('/logout', {}).pipe(
      map(res => {
        if (res.code === 200) {
          return new authActions.LogoutSuccess();
        }
      }),)
    ));

  @Effect({ dispatch: false })
  logoutSuccess = this.actions
    .ofType(authActions.LOGOUT_SUCCESS).pipe(
    tap(() => {
      this.apiService.setAuthKey(null);
      this.router.navigateByUrl('login');
    }));
  
  @Effect()
  register = this.actions
    .ofType(authActions.REGISTER).pipe(
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
    ));
  
  @Effect({ dispatch: false })
  notLoggedIn = this.actions
    .ofType(authActions.NOT_LOGGED_IN).pipe(
    tap(() => this.router.navigateByUrl('login')));

  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService,
    private router: Router
  ) {}
}