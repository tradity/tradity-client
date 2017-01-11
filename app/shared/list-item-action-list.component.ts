import { Component, Directive, HostListener } from '@angular/core';

import { ListItemComponent } from './list-item.component';

@Directive({ selector: '[tradity-action-expand]' })
export class ListItemActionExpandDirective {
  @HostListener('click') onClick() {
    this.listElem.toggleExpand();
  }

  constructor(private listElem: ListItemComponent) { }
}

@Component({
  selector: 'tradity-li-action-list',
  template: '<ng-content></ng-content>',
  styleUrls: ['app/shared/list-item-action-list.component.css']
})
export class ListItemActionListComponent { }