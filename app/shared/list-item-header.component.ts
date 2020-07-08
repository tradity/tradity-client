import { Component } from '@angular/core';

@Component({
  selector: 'tradity-li-header',
  styleUrls: ['list-item-header.component.css'],
  template: '<span><ng-content select="[left]"></ng-content></span><span><ng-content select="[right]"></ng-content></span>'
})
export class ListItemHeaderComponent {
  constructor() { }
}