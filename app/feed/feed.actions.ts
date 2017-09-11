import { Action } from '@ngrx/store';

import { FeedEvent } from './feedEvent.model';

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const LOAD_EVENTS = 'LOAD_EVENTS';

export class ReceiveEvents implements Action {
  readonly type = RECEIVE_EVENTS;
  constructor(public payload: FeedEvent[]) {}
}

export class LoadEvents implements Action {
  readonly type = LOAD_EVENTS;
}

export type All
  = ReceiveEvents
  | LoadEvents