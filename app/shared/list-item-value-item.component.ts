import { Component } from '@angular/core';

@Component({
  selector: 'tradity-li-vi',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      flex-basis: calc(50% - 40px);
      flex-direction: column;
      justify-content: center;
      padding: 10px 20px;
      border-top: 2px solid rgba(23,8,4,0.1);
      overflow: hidden;
    }
    
    :host >>> span:first-of-type {
      margin-bottom: 3px;
      font-size: 10px;
      line-height: 12px;
      font-weight: normal;
      text-transform: uppercase;
    }`]
})
export class ListItemValueItemComponent {
  constructor() { }
}