import { Action } from '@ngrx/store';

import { Stock } from './stock.model';
import { SellBuy } from './stocks.reducer';

export const RECEIVE_STOCK = 'RECEIVE_STOCK';
export const INPUT_SEARCH = 'INPUT_SEARCH';
export const RECEIVE_SEARCH_RESULTS = 'RECEIVE_SEARCH_RESULTS';
export const SELECT_STOCK = 'SELECT_STOCK';
export const LOAD_STOCK = 'LOAD_STOCK';
export const INPUT_SELL_BUY = 'INPUT_SELL_BUY';
export const INPUT_TRADE_AMOUNT = 'INPUT_TRADE_AMOUNT';
export const INPUT_TRADE_VALUE = 'INPUT_TRADE_VALUE';
export const TRADE = 'TRADE';
export const TRADE_SUCCESS = 'TRADE_SUCCESS';
export const TRADE_FAILURE = 'TRADE_FAILURE';

export class ReceiveStock implements Action {
  readonly type = RECEIVE_STOCK;
  constructor(public payload: Stock) {}
}

export class SelectStock implements Action {
  readonly type = SELECT_STOCK;
  constructor(public payload: string) {}
}

export class LoadStock implements Action {
  readonly type = LOAD_STOCK;
  constructor(public payload: string) {}
}

export class InputSearch implements Action {
  readonly type = INPUT_SEARCH;
  constructor(public payload: string) {}
}

export class ReceiveSearchResults implements Action {
  readonly type = RECEIVE_SEARCH_RESULTS;
  constructor(public payload: Stock[]) {}
}

export class InputSellBuy implements Action {
  readonly type = INPUT_SELL_BUY;
  constructor(public payload: SellBuy) {}
}

export class InputTradeAmount implements Action {
  readonly type = INPUT_TRADE_AMOUNT;
  constructor(public payload: number) {}
}

export class InputTradeValue implements Action {
  readonly type = INPUT_TRADE_VALUE;
  constructor(public payload: number) {}
}

export class Trade implements Action {
  readonly type = TRADE;
}

export class TradeSuccess implements Action {
  readonly type = TRADE_SUCCESS;
  constructor(public payload: { delayed: boolean }) {}
}

export class TradeFailure implements Action {
  readonly type = TRADE_FAILURE;
  constructor(public payload: string) {}
}

export type All
  = ReceiveStock
  | SelectStock
  | LoadStock
  | ReceiveSearchResults
  | InputSearch
  | InputSellBuy
  | InputTradeAmount
  | InputTradeValue
  | Trade
  | TradeSuccess
  | TradeFailure