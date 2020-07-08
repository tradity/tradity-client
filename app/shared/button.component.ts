import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'button[tradity-button]',
  styles: [`
    :host[type=submit] {
      flex-basis: 100%;
      margin-top: 15px;
      height: 3rem;
      background-color: rgba(241,89,42,0.95);
      box-shadow: 0 2px 1px 0 #F1592A;
      border: 1px solid rgba(241,89,42,0.97);
      border-radius: 3px;
      color: white;
      font-family: inherit;
      font-size: 16px;
      line-height: 19px;
    }
    
    :host[type=submit]:disabled {
      opacity: 0.8;
    }`],
  template: '<ng-content></ng-content>'
})
export class ButtonComponent { }