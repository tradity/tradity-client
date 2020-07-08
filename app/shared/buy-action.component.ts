import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as stocksActions from '../stocks/stocks.actions';
import { SellBuy } from '../stocks/stocks.reducer';

@Component({
  selector: 'tradity-action-buy',
  template: '<tradity-icon>add</tradity-icon>'
})
export class BuyActionComponent {
  @HostBinding('attr.role') role = 'link';
  @HostListener('click') onclick() {
    this.store.dispatch(new stocksActions.InputSellBuy(SellBuy.Buy));
    this.router.navigateByUrl('/stocks/' + this.isin + '/trade');
  }
  @Input() isin: string;

  constructor(private router: Router, private store: Store<any>) { }
}