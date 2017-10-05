import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as actions from './app.actions';

export interface State {
  inputFocus: boolean;
}

export const initialState: State = {
  inputFocus: false
}

export function appReducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.SET_INPUT_FOCUS: {
      return {
        ...state,
        inputFocus: action.payload
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