import { createSelector, createFeatureSelector } from '@ngrx/store';

import { Stock } from './stock.model';
import * as actions from './stocks.actions';

interface State {
  stocks: { [isin: string]: Stock };
  selectedIsin: string;
  searchValue: string;
  searchResults: Stock[];
}

const initialState: State = {
  stocks: {},
  selectedIsin: '',
  searchValue: '',
  searchResults: []
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
        selectedIsin: action.payload
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