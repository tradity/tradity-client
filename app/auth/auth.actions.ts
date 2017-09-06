import { Action } from '@ngrx/store';

import { User } from './user.model';

export const RECEIVE_USER = 'RECEIVE_USER';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const REGISTER = 'REGISTER';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAILED = 'REGISTRATION_FAILED';
export const LOGOUT = 'LOGOUT';
export const UPDATE_LOGIN_FORM = 'UPDATE_LOGIN_FORM';

export class ReceiveUser implements Action {
  readonly type = RECEIVE_USER;
  constructor(public payload: User) {}
}

export class Login implements Action {
  readonly type = LOGIN;
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: { uid: number, authKey: string }) {}
}

export class LoginFailed implements Action {
  readonly type = LOGIN_FAILED;
}

export class Register implements Action {
  readonly type = REGISTER;
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

export class UpdateLoginForm implements Action {
  readonly type = UPDATE_LOGIN_FORM;
  constructor(public payload: { key: string, value: string | boolean }) {}
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
  | UpdateLoginForm