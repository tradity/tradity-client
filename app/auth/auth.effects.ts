import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApiService } from '../core/api.service';
import * as authActions from './auth.actions';
import { getLoginForm } from './auth.reducer';

@Injectable()
export class AuthEffects {
  @Effect()
  login = this.actions
    .ofType(authActions.LOGIN)
    .withLatestFrom(this.store.select(getLoginForm))
    .switchMap(([action, loginForm]) => this.apiService
      .post('/login', {
        name: loginForm.username,
        pw: loginForm.password,
        stayloggedin: loginForm.stayLoggedIn
      })
      .map(res => res.json())
      .map(res => {
        if (res.code === 200) {
          return new authActions.LoginSuccess({ uid: res.uid, authKey: res.key });
        }
        return new authActions.LoginFailed();
      })
    );

  @Effect({ dispatch: false })
  loginSuccess = this.actions
    .ofType(authActions.LOGIN_SUCCESS)
    .do(() => this.router.navigateByUrl('dashboard'));
  
  @Effect({ dispatch: false })
  loginFailed = this.actions
    .ofType(authActions.LOGIN_FAILED)
    .do(() => alert('Wrong username or password'));
  
  @Effect({ dispatch: false })
  logout = this.actions
    .ofType(authActions.LOGOUT)
    .do(() => this.router.navigateByUrl('login'));

  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService,
    private router: Router
  ) {}
}