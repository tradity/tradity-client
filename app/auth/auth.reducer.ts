import { createSelector, createFeatureSelector } from '@ngrx/store';

import { User } from './user.model';
import * as actions from './auth.actions';

export interface State {
  user: User;
  uid: number;
  authKey: string;
  loggingIn: boolean;
  loggedIn: boolean;
}

export const initialState: State = {
  user: {
    dschoolid: null,
    email: null,
    email_verif: null,
    freemoney: null,
    name: null,
    profilepic: null,
    totalvalue: null,
    uid: null
  },
  uid: null,
  authKey: null,
  loggingIn: false,
  loggedIn: false
}

export function authReducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.RECEIVE_USER: {
      return Object.assign({}, state, { user: action.payload });
    }

    case actions.LOGIN: {
      return Object.assign({}, state, { loggingIn: true });
    }

    case actions.LOGIN_SUCCESS: {
      return Object.assign(
        {},
        state,
        {
          uid: action.payload.uid,
          authKey: action.payload.authKey,
          loggingIn: false,
          loggedIn: true
        }
      );
    }

    case actions.LOGOUT_SUCCESS: {
      return initialState;
    }

    case actions.NOT_LOGGED_IN: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const getAuthState = createFeatureSelector<State>('auth');

export const getUser = createSelector(
  getAuthState,
  (state: State) => state.user
);

export const getAuthKey = createSelector(
  getAuthState,
  (state: State) => state.authKey
);

export const getLoggedIn = createSelector(
  getAuthState,
  (state: State) => state.loggedIn
);

export const getLoggingIn = createSelector(
  getAuthState,
  (state: State) => state.loggingIn
);