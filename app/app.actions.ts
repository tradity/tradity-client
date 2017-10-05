import { Action } from '@ngrx/store';

export const SET_INPUT_FOCUS = 'SET_INPUT_FOCUS';

export class SetInputFocus implements Action {
  readonly type = SET_INPUT_FOCUS;
  constructor(public payload: boolean) {}
}

export type All
  = SetInputFocus