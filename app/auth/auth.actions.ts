import { Action } from '@ngrx/store';

import { UserResponse } from './user.model';

export const RECEIVE_USER = 'RECEIVE_USER';
export const LOAD_USER = 'LOAD_USER';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const REGISTER = 'REGISTER';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAILED = 'REGISTRATION_FAILED';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const NOT_LOGGED_IN = 'NOT_LOGGED_IN';

export class ReceiveUser implements Action {
  readonly type = RECEIVE_USER;
  constructor(public payload: UserResponse) {}
}

export class LoadUser implements Action {
  readonly type = LOAD_USER;
  constructor(public payload: boolean = false) {}
}

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload: { username: string, password: string, stayLoggedIn: boolean }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
}

export class LoginFailed implements Action {
  readonly type = LOGIN_FAILED;
}

export class Register implements Action {
  readonly type = REGISTER;
  constructor(public payload: any) {}
}

export class RegistrationSuccess implements Action {
  readonly type = REGISTRATION_SUCCESS;
  constructor(public payload: { uid: number, authKey: string }) {}
}

export class RegistrationFailed implements Action {
  readonly type = REGISTRATION_FAILED;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LogoutSuccess implements Action {
  readonly type = LOGOUT_SUCCESS;
}

export class NotLoggedIn implements Action {
  readonly type = NOT_LOGGED_IN;
}

export type All
  = ReceiveUser
  | Login
  | LoginSuccess
  | LoginFailed
  | Register
  | RegistrationSuccess
  | RegistrationFailed
  | Logout
  | LogoutSuccess
  | NotLoggedIn