import { Component } from '@angular/core';

@Component({
  selector: 'tradity-li-vl',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      flex-basis: 100%;
      overflow: hidden;
      font-size: 14px;
      font-weight: bold;
      line-height: 17px;
    }
    
    :host-context(tradity-li) {
      display: none;
    }
    
    :host-context(tradity-li.expanded) {
      display: flex;
    }`]
})
export class ListItemValueListComponent {
  constructor() { }
}