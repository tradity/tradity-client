import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as actions from './app.actions';

export interface Notification {
  id: number;
  type: string;
  message: string;
}

export interface State {
  inputFocus: boolean;
  notifications: Notification[];
  notificationsIdCount: number;
}

export const initialState: State = {
  inputFocus: false,
  notifications: [],
  notificationsIdCount: 0
}

export function appReducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.SET_INPUT_FOCUS: {
      return {
        ...state,
        inputFocus: action.payload
      }
    }

    case actions.CREATE_NOTIFICATION: {
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: state.notificationsIdCount,
            type: action.payload.type,
            message: action.payload.message
          }
        ],
        notificationsIdCount: state.notificationsIdCount + 1
      }
    }

    case actions.CLOSE_NOTIFICATION: {
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      }
    }

    default: {
      return state;
    }
  }
}

export const getAppState = createFeatureSelector<State>('app');

export const getInputFocus = createSelector(
  getAppState,
  (state: State) => state.inputFocus
);

export const getNotifications = createSelector(
  getAppState,
  (state: State) => state.notifications
);