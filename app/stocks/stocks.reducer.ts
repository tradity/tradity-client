import { createSelector, createFeatureSelector } from '@ngrx/store';

import { Stock } from './stock.model';
import * as actions from './stocks.actions';

export const enum SellBuy {
  Sell = -1,
  Buy = 1
}

interface State {
  stocks: { [isin: string]: Stock };
  selectedIsin: string;
  searchValue: string;
  searchResults: Stock[];
  sellBuy: SellBuy;
  tradeAmount: number;
  tradeValue: number;
}

const initialState: State = {
  stocks: {},
  selectedIsin: '',
  searchValue: '',
  searchResults: [],
  sellBuy: SellBuy.Buy,
  tradeAmount: null,
  tradeValue: null
}

export function stocksReducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.RECEIVE_STOCK: {
      return Object.assign(
        {},
        state,
        {
          stocks: {
            [action.payload.stocktextid]: action.payload
          }
        }
      )
    }

    case actions.SELECT_STOCK: {
      return {
        ...state,
        selectedIsin: action.payload,
        stocks: {
          ...state.stocks,
          [action.payload]: state.stocks[action.payload] || {
            ask: null,
            bid: null,
            lastvalue: null,
            name: null,
            pieces: null,
            stocktextid: action.payload
          }
        }
      }
    }

    case actions.INPUT_SEARCH: {
      return {
        ...state,
        searchValue: action.payload,
        searchResults: action.payload.length < 3 ? [] : state.searchResults
      }
    }

    case actions.RECEIVE_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: action.payload
      }
    }

    case actions.INPUT_SELL_BUY: {
      let tradeValue = initialState.tradeValue;
      if (state.tradeAmount) {
        if (action.payload === SellBuy.Buy) {
          tradeValue = parseFloat(((state.stocks[state.selectedIsin].ask / 10000) * state.tradeAmount).toFixed(2));
        } else {
          tradeValue = parseFloat(((state.stocks[state.selectedIsin].bid / 10000) * state.tradeAmount).toFixed(2));
        }
      }
      return {
        ...state,
        sellBuy: action.payload,
        tradeValue: tradeValue
      }
    }

    case actions.INPUT_TRADE_AMOUNT: {
      let tradeValue = initialState.tradeValue;
      if (action.payload) {
        if (state.sellBuy === SellBuy.Buy) {
          tradeValue = parseFloat(((state.stocks[state.selectedIsin].ask / 10000) * action.payload).toFixed(2));
        } else {
          tradeValue = parseFloat(((state.stocks[state.selectedIsin].bid / 10000) * action.payload).toFixed(2));
        }
      }
      return {
        ...state,
        tradeAmount: action.payload,
        tradeValue: tradeValue
      }
    }

    case actions.INPUT_TRADE_VALUE: {
      let tradeAmount = initialState.tradeAmount;
      if (action.payload) {
        if (state.sellBuy === SellBuy.Buy) {
          tradeAmount = Math.floor(action.payload / (state.stocks[state.selectedIsin].ask / 10000));
        } else {
          tradeAmount = Math.floor(action.payload / (state.stocks[state.selectedIsin].bid / 10000));
        }
      }
      return {
        ...state,
        tradeValue: action.payload,
        tradeAmount: tradeAmount
      }
    }

    default: {
      return state;
    }
  }
}

export const getStocksState = createFeatureSelector<State>('stocks');

export const getStocks = createSelector(
  getStocksState,
  (state: State) => state.stocks
);

export const getSelectedIsin = createSelector(
  getStocksState,
  (state: State) => state.selectedIsin
);

export const getSelectedStock = createSelector(
  getStocks,
  getSelectedIsin,
  (stocks, isin) => stocks[isin]
);

export const getSearchValue = createSelector(
  getStocksState,
  (state: State) => state.searchValue
);

export const getSearchResults = createSelector(
  getStocksState,
  (state: State) => state.searchResults
);

export const getSellBuy = createSelector(
  getStocksState,
  (state: State) => state.sellBuy
);

export const getTradeAmount = createSelector(
  getStocksState,
  (state: State) => state.tradeAmount
);

export const getTradeValue = createSelector(
  getStocksState,
  (state: State) => state.tradeValue
);