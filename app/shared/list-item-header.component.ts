import { Component } from '@angular/core';

@Component({
  selector: 'tradity-li-header',
  styles: [`
    :host {
      display: flex;
      flex-basis: 100%;
      overflow: hidden;
      font-size: 16px;
      font-weight: bold;
      line-height: 19px;
      min-height: 62px;
    }
    
    :host.big-letters {
      font-size: 24px;
      font-weight: 900;
      line-height: 29px;
    }
    
    :host > span {
      display: flex;
      flex-basis: 50%;
      flex-direction: column;
      justify-content: center;
      padding: 10px 20px;
      overflow: hidden;
    }
    
    :host.no-right > span:nth-of-type(1) {
      flex-basis: 100%;
    }
    
    :host.no-right > span:nth-of-type(2) {
      display: none;
    }
    
    :host >>> span[left]:nth-of-type(2) {
      margin-top: 8px;
      font-size: 12px;
      line-height: 15px;
      font-weight: normal;
    }
    
    :host.big-letters >>> span[left]:nth-of-type(2) {
      margin-top: 0;
      font-size: 16px;
      line-height: 19px;
    }`],
  template: '<span><ng-content select="[left]"></ng-content></span><span><ng-content select="[right]"></ng-content></span>'
})
export class ListItemHeaderComponent {
  constructor() { }
}