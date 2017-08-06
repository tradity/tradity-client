import { createSelector, createFeatureSelector } from '@ngrx/store';

import { FeedEvent } from './feedEvent.model';
import * as actions from './feed.actions';

export function feedReducer(state: [FeedEvent] = <[FeedEvent]>[], action: actions.All): [FeedEvent] {
  switch (action.type) {
    case actions.RECEIVE_EVENTS: {
      return action.payload;
    }

    default: {
      return state;
    }
  }
}

export const getFeedEvents = createFeatureSelector<[FeedEvent]>('feed');