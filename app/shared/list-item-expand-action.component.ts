import { Component, HostBinding, HostListener } from '@angular/core';

import { ListItemComponent } from './list-item.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-action-expand',
  template: '<tradity-icon></tradity-icon>',
  styleUrls: ['list-item-expand-action.component.css']
})
export class ListItemExpandActionComponent {
  @HostBinding('attr.role') role = 'button';
  @HostListener('click') onClick() {
    this.listElem.toggleExpand();
  }

  constructor(private listElem: ListItemComponent) { }
}