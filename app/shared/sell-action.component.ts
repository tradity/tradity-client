import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as stocksActions from '../stocks/stocks.actions';
import { SellBuy } from '../stocks/stocks.reducer';

@Component({
  moduleId: module.id,
  selector: 'tradity-action-sell',
  template: '<tradity-icon>remove</tradity-icon>'
})
export class SellActionComponent {
  @HostBinding('attr.role') role = 'link';
  @HostListener('click') onclick() {
    this.store.dispatch(new stocksActions.InputSellBuy(SellBuy.Sell));
    this.router.navigateByUrl('/stocks/' + this.isin + '/trade');
  }
  @Input() isin: string;

  constructor(private router: Router, private store: Store<any>) { }
}