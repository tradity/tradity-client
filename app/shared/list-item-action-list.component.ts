import { Component } from '@angular/core';

@Component({
  selector: 'tradity-li-action-list',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      flex-basis: 100%;
      justify-content: space-around;
      margin: -5px 0 5px;
    }
    
    :host >>> a {
      text-decoration: none;
      color: rgba(23,8,4,0.8);
    }`]
})
export class ListItemActionListComponent { }