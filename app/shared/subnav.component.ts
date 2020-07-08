import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[tradity-subnav]',
  styles: [`
    :host >>> ul {
      list-style: none;
      padding: 0;
      margin: 0 0 20px 0;
    }
    
    :host >>> li {
      display: inline;
      margin-right: 10px;
    }
    
    :host >>> a {
      color: #170804;
      font-size: 12px;
      font-weight: bold;
      line-height: 15px;
      letter-spacing: 2px;
      text-decoration: none;
      text-transform: uppercase;
      padding: 3px 7px;
      border-radius: 5px;
    }
    
    :host >>> a.active {
      background-color: darkblue;
      color: white;
    }  
  `],
  template: '<ng-content></ng-content>'
})
export class SubnavComponent { }