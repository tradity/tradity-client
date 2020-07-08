import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tradity-li',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      margin: 0 0 10px 60px;
      position: relative;
      background-color: rgba(23,8,4,0.02);
      border-radius: 5px;
      color: rgba(23,8,4,0.8);
    }
    
    :host:last-of-type {
      margin-bottom: 0;
    }`]
})
export class ListItemComponent {
  @HostBinding('class.expanded') isExpanded: boolean = false;

  constructor() { }

  toggleExpand() {
    this.isExpanded = this.isExpanded ? false : true;
  }
}