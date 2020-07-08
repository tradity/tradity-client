import { Component, HostBinding, HostListener } from '@angular/core';

import { ListItemComponent } from './list-item.component';

@Component({
  selector: 'tradity-action-expand',
  template: '<tradity-icon></tradity-icon>',
  styles: [`
    tradity-icon::before {
      content: "expand_more";
    }
    
    :host-context(tradity-li.expanded) tradity-icon::before {
      content: "expand_less";
    }`]
})
export class ListItemExpandActionComponent {
  @HostBinding('attr.role') role = 'button';
  @HostListener('click') onClick() {
    this.listElem.toggleExpand();
  }

  constructor(private listElem: ListItemComponent) { }
}