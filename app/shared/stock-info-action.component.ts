import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tradity-action-stock-info',
  template: '<tradity-icon>info_outline</tradity-icon>'
})
export class StockInfoActionComponent {
  @HostBinding('attr.role') role = 'link';
  @HostListener('click') onclick() {
    this.router.navigateByUrl('/stocks/' + this.isin);
  }
  @Input() isin: string;

  constructor(private router: Router) { }
}