import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tradity-li',
  template: '<ng-content></ng-content>',
  styleUrls: ['app/shared/list-item.component.css']
})
export class ListItemComponent {
  @HostBinding('class.expanded') isExpanded: boolean = false;

  constructor() { }

  toggleExpand() {
    this.isExpanded = this.isExpanded ? false : true;
  }
}