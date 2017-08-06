import { Action } from '@ngrx/store';

import { FeedEvent } from './feedEvent.model';

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';

export class ReceiveEvents implements Action {
  readonly type = RECEIVE_EVENTS;
  constructor(public payload: [FeedEvent]) {}
}

export type All
  = ReceiveEvents