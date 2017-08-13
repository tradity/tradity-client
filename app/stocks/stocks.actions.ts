import { Action } from '@ngrx/store';

import { Stock } from './stock.model';

export const RECEIVE_STOCK = 'RECEIVE_STOCK';
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';
export const SELECT_STOCK = 'SELECT_STOCK';

export class ReceiveStock implements Action {
  readonly type = RECEIVE_STOCK;
  constructor(public payload: Stock) {}
}

export class SelectStock implements Action {
  readonly type = SELECT_STOCK;
  constructor(public payload: string) {}
}

export class ReceiveSearchResults implements Action {
  readonly type = RECEIVE_SEARCH_RESULTS;
  constructor(public payload: Stock[]) {}
}

export type All
  = ReceiveStock
  | SelectStock
  | ReceiveSearchResults