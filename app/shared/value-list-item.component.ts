import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-vl-li',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      flex-basis: 50%;
      flex-direction: column;
      align-items: center;
      padding: 5px 0;
      margin: 5px 0;
    }
    
    :host:nth-of-type(1),
    :host:nth-of-type(3) {
      flex-basis: calc(50% - 1px);
      border-right: 1px solid rgba(151, 151, 151, 0.37);
    }
    
    :host >>> span:nth-of-type(1) {
      font-size: 16px;
      line-height: 19px;
      color: #F1592A;
    }
    
    :host >>> span:nth-of-type(2) {
      font-size: 10px;
      line-height: 12px;
      color: white;
    }
  `]
})
export class ValueListItemComponent { }