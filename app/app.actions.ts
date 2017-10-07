import { Action } from '@ngrx/store';

export const SET_INPUT_FOCUS = 'SET_INPUT_FOCUS';
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

export class SetInputFocus implements Action {
  readonly type = SET_INPUT_FOCUS;
  constructor(public payload: boolean) {}
}

export class CreateNotification implements Action {
  readonly type = CREATE_NOTIFICATION;
  constructor(public payload: { type: string; message: string; }) {}
}

export class CloseNotification implements Action {
  readonly type = CLOSE_NOTIFICATION;
  constructor(public payload: number) {}
}

export type All
  = SetInputFocus
  | CreateNotification
  | CloseNotification