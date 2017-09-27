import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'tradity-action-sell',
  template: '<i class="material-icons">remove</i>'
})
export class SellActionComponent {
  @HostBinding('attr.role') role = 'link';
  @HostListener('click') onclick() {
    this.router.navigateByUrl('/stocks/' + this.isin + '/trade');
  }
  @Input() isin: string;

  constructor(private router: Router) { }
}