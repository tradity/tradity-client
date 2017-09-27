import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'tradity-action-stock-info',
  template: '<i class="material-icons">info_outline</i>'
})
export class StockInfoActionComponent {
  @HostBinding('attr.role') role = 'link';
  @HostListener('click') onclick() {
    this.router.navigateByUrl('/stocks/' + this.isin);
  }
  @Input() isin: string;

  constructor(private router: Router) { }
}